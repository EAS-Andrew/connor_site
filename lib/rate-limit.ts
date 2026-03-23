import Redis from 'ioredis';

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
          if (times > 3) return null;
          return Math.min(times * 200, 1000);
        },
      });

      redis.on('error', (err) => {
        console.error('Redis rate-limit error:', err);
      });
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      return null;
    }
  }

  return redis;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Sliding-window rate limiter backed by Redis sorted sets.
 * Falls back to allowing all requests if Redis is unavailable.
 */
export async function checkRateLimit(
  prefix: string,
  identifier: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const redisClient = getRedisClient();
  if (!redisClient) {
    return { success: true, limit: maxRequests, remaining: maxRequests, reset: Date.now() + windowSeconds * 1000 };
  }

  const key = `ratelimit:${prefix}:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  try {
    await redisClient.zremrangebyscore(key, 0, windowStart);
    const count = await redisClient.zcard(key);

    if (count >= maxRequests) {
      const oldestEntry = await redisClient.zrange(key, 0, 0, 'WITHSCORES');
      const resetTime = oldestEntry[1]
        ? parseInt(oldestEntry[1]) + windowSeconds * 1000
        : now + windowSeconds * 1000;

      return { success: false, limit: maxRequests, remaining: 0, reset: resetTime };
    }

    await redisClient.zadd(key, now, `${now}-${Math.random()}`);
    await redisClient.expire(key, windowSeconds);

    return { success: true, limit: maxRequests, remaining: maxRequests - count - 1, reset: now + windowSeconds * 1000 };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { success: true, limit: maxRequests, remaining: maxRequests, reset: now + windowSeconds * 1000 };
  }
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}
