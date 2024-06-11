import kue from 'kue';
import chai from 'chai';
import createPushNotificationsJobs from './8-job.js';

const { expect } = chai;

describe('createPushNotificationsJobs', function () {
  let queue;

  // Before all tests, set up the Kue queue in test mode
  before(function (done) {
    // Create a Kue queue
    queue = kue.createQueue({
      redis: {
        host: 'localhost', // Adjust this based on your Redis server configuration
        port: 6379,        // Redis default port
      },
    });

    // Enable Kue test mode to prevent processing of jobs
    queue.testMode.enter();

    done();
  });

  // After all tests, clear the queue and exit test mode
  after(function (done) {
    // Clear the queue
    queue.testMode.clear();

    // Exit Kue test mode
    queue.testMode.exit();

    done();
  });

  // Test case 1: Display an error message if jobs is not an array
  it('display a error message if jobs is not an array', function () {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw(
      'Jobs is not an array'
    );
  });

  // Test case 2: Create two new jobs to the queue
  it('create two new jobs to the queue', function () {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    // Assert that the jobs were created
    expect(queue.testMode.jobs.length).to.equal(2);

    // Assert that the first job was created with correct data
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.deep.equal(jobs[0]);

    // Assert that the second job was created with correct data
    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[1].data).to.deep.equal(jobs[1]);
  });

  // Add more test cases as needed
});
