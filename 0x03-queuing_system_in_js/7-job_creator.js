import kue from 'kue';

// Array of jobs
const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  }
];

// Create a Kue queue
const queue = kue.createQueue();

// Process jobs
jobs.forEach((jobData, index) => {
  const job = queue.create('push_notification_code_2', jobData)
    .priority('high')
    .save(err => {
      if (err) {
        console.error(`Error creating job ${index + 1}: ${err}`);
        return;
      }
      console.log(`Notification job created: ${job.id}`);
    });

  job.on('complete', () => {
    console.log(`Notification job ${job.id} completed`);
  });

  job.on('failed', err => {
    console.error(`Notification job ${job.id} failed: ${err}`);
  });

  job.on('progress', (progress, data) => {
    console.log(`Notification job ${job.id} ${progress}% complete`);
  });
});

// Log when queue is ready
queue.on('ready', () => {
  console.log('Kue is ready and waiting for jobs!');
});

// Log any Kue errors
queue.on('error', err => {
  console.error('Oops! Something went wrong with Kue:', err);
});
