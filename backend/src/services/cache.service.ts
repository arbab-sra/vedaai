import { createRedisConnection } from '../config/redis';

const cacheClient = createRedisConnection();

export const getCache = async (key: string) => {
  try {
    const data = await cacheClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const setCache = async (key: string, value: any, ttlSeconds: number = 60) => {
  try {
    await cacheClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

export const invalidateCache = async (key: string) => {
  try {
    await cacheClient.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};
