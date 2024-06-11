import kue from 'kue';

// Create a Kue queue
const queue = kue.createQueue();

// Define job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'Hello, this is a notification from your app!',
};

// Create a job and add it to the queue
const job = queue.create('push_notification_code', jobData);

// Job creation success event
job.on('enqueue', function () {
  console.log(`Notification job created: ${job.id}`);
});

// Job completion event
job.on('complete', function () {
  console.log('Notification job completed');
  process.exit(0); // Exit after job completion
});

// Job failure event
job.on('failed', function () {
  console.log('Notification job failed');
  process.exit(1); // Exit with error code 1 after job failure
});

// Save the job to the queue
job.save();
