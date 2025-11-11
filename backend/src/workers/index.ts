import dotenv from 'dotenv';
import Bull from 'bull';
import { logger } from '../utils/logger';

dotenv.config();

// Create job queues
export const emailQueue = new Bull('email-queue', {
  redis: {
    host: process.env.REDIS_URL?.split('://')[1]?.split(':')[0] || 'localhost',
    port: parseInt(process.env.REDIS_URL?.split(':')[2] || '6379'),
  },
});

export const sequenceQueue = new Bull('sequence-queue', {
  redis: {
    host: process.env.REDIS_URL?.split('://')[1]?.split(':')[0] || 'localhost',
    port: parseInt(process.env.REDIS_URL?.split(':')[2] || '6379'),
  },
});

// Email processing worker
emailQueue.process(async (job) => {
  logger.info(`Processing email job ${job.id}`, job.data);

  try {
    // Email sending logic will be implemented here
    // This will use SendGrid/Mailgun to send emails
    // and update the database with results

    logger.info(`Email job ${job.id} completed`);
    return { success: true };
  } catch (error) {
    logger.error(`Email job ${job.id} failed`, error);
    throw error;
  }
});

// Sequence processing worker
sequenceQueue.process(async (job) => {
  logger.info(`Processing sequence job ${job.id}`, job.data);

  try {
    // Sequence processing logic will be implemented here
    // This will check for scheduled emails and queue them

    logger.info(`Sequence job ${job.id} completed`);
    return { success: true };
  } catch (error) {
    logger.error(`Sequence job ${job.id} failed`, error);
    throw error;
  }
});

// Error handlers
emailQueue.on('error', (error) => {
  logger.error('Email queue error', error);
});

emailQueue.on('failed', (job, error) => {
  logger.error(`Email job ${job.id} failed`, { error, data: job.data });
});

sequenceQueue.on('error', (error) => {
  logger.error('Sequence queue error', error);
});

sequenceQueue.on('failed', (job, error) => {
  logger.error(`Sequence job ${job.id} failed`, { error, data: job.data });
});

logger.info('Workers started and listening for jobs');

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing workers gracefully');
  await emailQueue.close();
  await sequenceQueue.close();
  process.exit(0);
});
