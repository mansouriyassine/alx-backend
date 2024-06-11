import { createClient } from 'redis';

async function connectRedis() {
  const client = createClient();

  client.on('error', (err) => {
    console.log('Redis client not connected to the server:', err.message);
  });

  client.on('ready', () => {
    console.log('Redis client connected to the server');
  });

  try {
    await client.connect();
  } catch (err) {
    console.log('Redis client not connected to the server:', err.message);
  }
}

connectRedis();
