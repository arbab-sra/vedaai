import { Redis } from 'ioredis';
import { Queue, Worker } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log("Starting test...");
  
  const redisOptions = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    connectTimeout: 5000,
  };
  
  console.log("Redis options:", JSON.stringify({...redisOptions, password: '***'}));
  
  const redis = new Redis(redisOptions);
  
  redis.on('error', (err) => {
    console.error('Redis error:', err);
  });
  
  redis.on('connect', () => {
    console.log('Redis connected!');
  });
  
  redis.on('ready', async () => {
    console.log('Redis ready! Testing BullMQ queue...');
    const queue = new Queue('test-queue', { connection: redis });
    try {
      await queue.add('test-job', { foo: 'bar' });
      console.log('Job added successfully!');
    } catch (err) {
      console.error('Failed to add job:', err);
    }
    process.exit(0);
  });
}

test().catch(console.error);
