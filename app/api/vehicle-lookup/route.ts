import { NextRequest, NextResponse } from 'next/server';
import { lookupVehicleByVRM, extractVehicleYear, UKVDVehicleResponse } from '@/lib/ukvehicledata';
import Redis from 'ioredis';

// Cache TTL: 30 days (vehicle data doesn't change often)
const CACHE_TTL_SECONDS = 30 * 24 * 60 * 60;

// Rate limiting configuration
// IMPORTANT: With 400 API credits (£60), protect them carefully!
// Cached requests don't use credits, but first-time lookups do
const RATE_LIMIT_REQUESTS = 5; // requests per window
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour in seconds

// Initialize Redis client (reused across requests)
let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) {
            return null; // Stop retrying
          }
          return Math.min(times * 200, 1000); // Exponential backoff
        },
      });

      redis.on('error', (err) => {
        console.error('Redis error:', err);
      });
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      return null;
    }
  }

  return redis;
}

/**
 * Simple sliding window rate limiter using Redis
 * Returns { success, limit, remaining, reset }
 */
async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const redisClient = getRedisClient();
  if (!redisClient) {
    // No Redis = no rate limiting
    return {
      success: true,
      limit: RATE_LIMIT_REQUESTS,
      remaining: RATE_LIMIT_REQUESTS,
      reset: Date.now() + RATE_LIMIT_WINDOW_SECONDS * 1000,
    };
  }

  const key = `ratelimit:vehicle-lookup:${identifier}`;
  const now = Date.now();
  const windowStart = now - (RATE_LIMIT_WINDOW_SECONDS * 1000);

  try {
    // Remove old entries outside the window
    await redisClient.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const count = await redisClient.zcard(key);

    if (count >= RATE_LIMIT_REQUESTS) {
      // Rate limit exceeded
      const oldestEntry = await redisClient.zrange(key, 0, 0, 'WITHSCORES');
      const resetTime = oldestEntry[1]
        ? parseInt(oldestEntry[1]) + (RATE_LIMIT_WINDOW_SECONDS * 1000)
        : now + (RATE_LIMIT_WINDOW_SECONDS * 1000);

      return {
        success: false,
        limit: RATE_LIMIT_REQUESTS,
        remaining: 0,
        reset: resetTime,
      };
    }

    // Add current request
    await redisClient.zadd(key, now, `${now}-${Math.random()}`);
    await redisClient.expire(key, RATE_LIMIT_WINDOW_SECONDS);

    return {
      success: true,
      limit: RATE_LIMIT_REQUESTS,
      remaining: RATE_LIMIT_REQUESTS - count - 1,
      reset: now + (RATE_LIMIT_WINDOW_SECONDS * 1000),
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow the request
    return {
      success: true,
      limit: RATE_LIMIT_REQUESTS,
      remaining: RATE_LIMIT_REQUESTS,
      reset: now + (RATE_LIMIT_WINDOW_SECONDS * 1000),
    };
  }
}

/**
 * POST /api/vehicle-lookup
 * 
 * Lookup vehicle details by UK registration plate with caching and rate limiting
 * Body: { registration: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    // Get identifier (IP address or fallback)
    const ip = request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip') ??
      'anonymous';
    const identifier = `ip:${ip}`;

    const { success, limit, remaining, reset } = await checkRateLimit(identifier);

    // Add rate limit headers to response
    const rateLimitHeaders = {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(reset).toISOString(),
    };

    if (!success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again after ${new Date(reset).toLocaleTimeString()}`,
          limit,
          remaining: 0,
          reset: new Date(reset).toISOString(),
        },
        {
          status: 429,
          headers: rateLimitHeaders,
        }
      );
    }

    // Store headers to add to successful response later
    request.headers.set('x-ratelimit-limit', limit.toString());
    request.headers.set('x-ratelimit-remaining', remaining.toString());
    request.headers.set('x-ratelimit-reset', new Date(reset).toISOString());

    const body = await request.json();
    const { registration } = body;

    if (!registration || typeof registration !== 'string') {
      return NextResponse.json(
        { error: 'Registration plate is required' },
        { status: 400 }
      );
    }

    // Normalize registration for cache key
    const normalizedReg = registration.toUpperCase().replace(/\s+/g, '');
    const cacheKey = `vehicle:${normalizedReg}`;

    // Try to get from cache first
    const redisClient = getRedisClient();
    if (redisClient) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          console.log(`Cache HIT for ${normalizedReg}`);
          const vehicleData = JSON.parse(cached);

          // Build response with rate limit headers if available
          const responseHeaders: Record<string, string> = {};
          const rateLimitLimit = request.headers.get('x-ratelimit-limit');
          const rateLimitRemaining = request.headers.get('x-ratelimit-remaining');
          const rateLimitReset = request.headers.get('x-ratelimit-reset');

          if (rateLimitLimit) responseHeaders['X-RateLimit-Limit'] = rateLimitLimit;
          if (rateLimitRemaining) responseHeaders['X-RateLimit-Remaining'] = rateLimitRemaining;
          if (rateLimitReset) responseHeaders['X-RateLimit-Reset'] = rateLimitReset;

          return NextResponse.json(
            {
              success: true,
              vehicle: vehicleData,
              cached: true,
            },
            { headers: responseHeaders }
          );
        }
        console.log(`Cache MISS for ${normalizedReg}`);
      } catch (cacheError) {
        // Cache error - continue without cache
        console.warn('Cache read error:', cacheError);
      }
    }

    // Get API credentials from environment
    const apiKey = process.env.UK_VEHICLE_DATA_API_KEY;
    const packageName = process.env.UK_VEHICLE_DATA_PACKAGE_NAME || 'VehicleDetails';

    if (!apiKey) {
      console.error('UK_VEHICLE_DATA_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Vehicle lookup service is not configured' },
        { status: 500 }
      );
    }

    // Call UK Vehicle Data API
    const data: UKVDVehicleResponse = await lookupVehicleByVRM(
      registration,
      apiKey,
      packageName
    );

    // Extract the relevant vehicle information
    const vehicleDetails = data.Results?.VehicleDetails?.VehicleIdentification;
    const modelDetails = data.Results?.ModelDetails?.ModelIdentification;

    if (!vehicleDetails && !modelDetails) {
      return NextResponse.json(
        { error: 'No vehicle data found for this registration' },
        { status: 404 }
      );
    }

    // Construct the response in the format our app expects
    const vehicleData = {
      registration: normalizedReg,
      make: modelDetails?.Make || vehicleDetails?.DvlaMake || 'Unknown',
      model: modelDetails?.Model || vehicleDetails?.DvlaModel || 'Unknown',
      year: extractVehicleYear(data),
      variant: modelDetails?.ModelVariant || undefined,
      // Additional data that might be useful
      bodyStyle: data.Results?.ModelDetails?.BodyDetails?.BodyStyle,
      fuelType: vehicleDetails?.DvlaFuelType,
      vin: vehicleDetails?.Vin,
    };

    // Store in cache for future requests
    if (redisClient) {
      try {
        await redisClient.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(vehicleData));
        console.log(`Cached vehicle data for ${normalizedReg} (TTL: ${CACHE_TTL_SECONDS}s)`);
      } catch (cacheError) {
        // Cache write failed - not critical, just log it
        console.warn('Failed to cache vehicle data:', cacheError);
      }
    }

    // Build response with rate limit headers if available
    const responseHeaders: Record<string, string> = {};
    const rateLimitLimit = request.headers.get('x-ratelimit-limit');
    const rateLimitRemaining = request.headers.get('x-ratelimit-remaining');
    const rateLimitReset = request.headers.get('x-ratelimit-reset');

    if (rateLimitLimit) responseHeaders['X-RateLimit-Limit'] = rateLimitLimit;
    if (rateLimitRemaining) responseHeaders['X-RateLimit-Remaining'] = rateLimitRemaining;
    if (rateLimitReset) responseHeaders['X-RateLimit-Reset'] = rateLimitReset;

    return NextResponse.json(
      {
        success: true,
        vehicle: vehicleData,
        cached: false,
      },
      { headers: responseHeaders }
    );

  } catch (error) {
    console.error('Vehicle lookup error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('No vehicle data found')) {
        return NextResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        );
      }

      if (error.message.includes('API error')) {
        return NextResponse.json(
          { error: 'Vehicle lookup service temporarily unavailable' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to lookup vehicle' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/vehicle-lookup
 * 
 * Health check endpoint
 */
export async function GET() {
  const isApiConfigured = !!process.env.UK_VEHICLE_DATA_API_KEY;
  const isRedisConfigured = !!process.env.REDIS_URL;

  return NextResponse.json({
    service: 'UK Vehicle Data Lookup',
    api: isApiConfigured ? 'configured' : 'not configured',
    cache: isRedisConfigured ? 'configured' : 'not configured',
    rateLimit: isRedisConfigured ? {
      enabled: true,
      limit: RATE_LIMIT_REQUESTS,
      window: `${RATE_LIMIT_WINDOW_SECONDS / 3600} hour(s)`,
    } : {
      enabled: false,
    },
  });
}

