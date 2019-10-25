import redis from 'redis';
import dotenv from 'dotenv';
import { bold } from 'chalk';

dotenv.config();
const { REDIS_URL } = process.env;

const client = redis.createClient(REDIS_URL);

const connected = bold.cyan;
const errorMessage = bold.yellow;
const disconnected = bold.red;
const termination = bold.magenta;

client.on('connect', () => {
  console.log(connected('Redis client connected'));
});

process.on('exit', function() {
  client.quit();
});

client.on('error', error => {
  console.log(errorMessage(`Something went wrong ${error}`));
});

export default client;
