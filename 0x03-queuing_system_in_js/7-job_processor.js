import kue from 'kue';

// Array of blacklisted phone numbers
const blacklisted = ['4153518780', '4153518781'];

// Create a function to send notification
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100);

  if (blacklisted.includes(phoneNumber)) {
    const error = new Error(`Phone number ${phoneNumber} is blacklisted`);
    job.failed().error(error);
    done(error);
  } else {
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
  }
}

// Create a Kue queue
const queue = kue.createQueue({
  prefix: 'q',
  redis: {
    port: 6379,
    host: '127.0.0.1',
  }
});

// Process jobs
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

// Log when queue is ready
queue.on('ready', () => {
  console.log('Kue is ready and waiting for jobs!');
});

// Log any Kue errors
queue.on('error', err => {
  console.error('Oops! Something went wrong with Kue:', err);
});
