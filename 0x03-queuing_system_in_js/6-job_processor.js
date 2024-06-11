import kue from 'kue';

// Create a Kue queue
const queue = kue.createQueue();

// Function to send notification
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process jobs in the push_notification_code queue
queue.process('push_notification_code', function (job, done) {
  const { phoneNumber, message } = job.data;
  
  // Send notification
  sendNotification(phoneNumber, message);
  
  // Notify completion
  done();
});

// Log when queue is ready
queue.on('ready', () => {
  console.log('Kue is ready and waiting for jobs!');
});

// Log any Kue errors
queue.on('error', err => {
  console.error('Oops! Something went wrong with Kue:', err);
});
