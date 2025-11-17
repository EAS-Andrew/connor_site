/**
 * Photo Token System
 * Generates secure tokens for photo upload flow
 * Stores order data in Redis with 7-day expiry
 */

import Redis from 'ioredis';
import { randomUUID } from 'crypto';

const TOKEN_PREFIX = 'photo_token:';
const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redis) return redis;

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.error('REDIS_URL not configured');
    return null;
  }

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    return redis;
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    return null;
  }
}

export interface PhotoTokenData {
  shopifyOrderId: string;
  shopifyOrderName: string;
  email: string;
  vehicleData: {
    registration: string;
    make: string;
    model: string;
    year: string;
    variant?: string;
  };
  createdAt: string;
}

/**
 * Generate a secure photo upload token
 */
export function generatePhotoToken(): string {
  return randomUUID();
}

/**
 * Store token with order data in Redis
 */
export async function storePhotoToken(
  token: string,
  data: PhotoTokenData
): Promise<boolean> {
  const redisClient = getRedisClient();
  if (!redisClient) {
    console.error('Cannot store token: Redis not available');
    return false;
  }

  try {
    const key = `${TOKEN_PREFIX}${token}`;
    const value = JSON.stringify(data);
    
    await redisClient.setex(key, TOKEN_EXPIRY_SECONDS, value);
    console.log(`Photo token stored: ${token} (expires in 7 days)`);
    return true;
  } catch (error) {
    console.error('Failed to store photo token:', error);
    return false;
  }
}

/**
 * Validate token and retrieve order data
 */
export async function validatePhotoToken(
  token: string
): Promise<PhotoTokenData | null> {
  const redisClient = getRedisClient();
  if (!redisClient) {
    console.error('Cannot validate token: Redis not available');
    return null;
  }

  try {
    const key = `${TOKEN_PREFIX}${token}`;
    const value = await redisClient.get(key);

    if (!value) {
      console.log(`Token not found or expired: ${token}`);
      return null;
    }

    const data = JSON.parse(value) as PhotoTokenData;
    console.log(`Token validated: ${token} for order ${data.shopifyOrderName}`);
    return data;
  } catch (error) {
    console.error('Failed to validate photo token:', error);
    return null;
  }
}

/**
 * Delete token after use (one-time use)
 */
export async function deletePhotoToken(token: string): Promise<boolean> {
  const redisClient = getRedisClient();
  if (!redisClient) {
    console.error('Cannot delete token: Redis not available');
    return false;
  }

  try {
    const key = `${TOKEN_PREFIX}${token}`;
    await redisClient.del(key);
    console.log(`Photo token deleted: ${token}`);
    return true;
  } catch (error) {
    console.error('Failed to delete photo token:', error);
    return false;
  }
}

