import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';

const app = express();
const PORT = 1245;

// Redis client setup
const redisClient = redis.createClient();
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Kue setup
const queue = kue.createQueue();

// Initialize available seats and reservation status
let availableSeats = 50;
let reservationEnabled = true;

// Function to reserve a seat in Redis
async function reserveSeat(number) {
  await setAsync('available_seats', number.toString());
}

// Function to get current available seats from Redis
async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats');
  return seats ? parseInt(seats) : 0;
}

// Middleware to parse JSON requests
app.use(express.json());

// Route to get current number of available seats
app.get('/available_seats', async (req, res) => {
  res.json({ numberOfAvailableSeats: availableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  // Queue a job to reserve a seat
  const job = queue.create('reserve_seat', {}).save(err => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });

  // Log job success/failure
  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  }).on('failed', err => {
    console.log(`Seat reservation job ${job.id} failed: ${err}`);
  });
});

// Route to process the queue and reserve a seat
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const currentSeats = await getCurrentAvailableSeats();
    
    if (currentSeats === 0) {
      reservationEnabled = false;
      return done(new Error('Not enough seats available'));
    }

    availableSeats--;
    await reserveSeat(availableSeats);

    if (availableSeats === 0) {
      reservationEnabled = false;
    }

    done();
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
