import Redis from 'ioredis';

export const createRedisConnection = () => {
  const redisOptions = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  };

  const connection = new Redis(redisOptions as any);
  connection.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
  return connection;
};
