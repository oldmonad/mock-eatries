import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();
const { REDIS_PORT } = process.env;

const client = redis.createClient(REDIS_PORT);

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', error => {
  console.log(`Something went wrong ${error}`);
});

export default client;
