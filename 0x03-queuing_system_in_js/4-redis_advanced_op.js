import { createClient, print } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.message);
});

client.on('ready', () => {
  console.log('Redis client connected to the server');
  
  // Create Hash
  client.hset(
    'HolbertonSchools',
    'Portland',
    50,
    print
  );
  client.hset(
    'HolbertonSchools',
    'Seattle',
    80,
    print
  );
  client.hset(
    'HolbertonSchools',
    'New York',
    20,
    print
  );
  client.hset(
    'HolbertonSchools',
    'Bogota',
    20,
    print
  );
  client.hset(
    'HolbertonSchools',
    'Cali',
    40,
    print
  );
  client.hset(
    'HolbertonSchools',
    'Paris',
    2,
    (err, reply) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log('Reply:', reply);
        // Display Hash
        client.hgetall('HolbertonSchools', (err, obj) => {
          if (err) {
            console.log(err.message);
          } else {
            console.log(obj);
            // Disconnect from Redis
            client.quit();
          }
        });
      }
    }
  );
});

client.connect().catch((err) => {
  console.log('Redis client not connected to the server:', err.message);
});
