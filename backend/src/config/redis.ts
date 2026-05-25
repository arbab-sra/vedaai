import Redis from 'ioredis';

export const createRedisConnection = () => {
  if (process.env.REDIS_URL) {
    const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
    connection.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
    return connection;
  }

  const redisOptions: any = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  };

  if (process.env.REDIS_TLS === 'true') {
    redisOptions.tls = {};
  }

  const connection = new Redis(redisOptions);
  connection.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
  return connection;
};
