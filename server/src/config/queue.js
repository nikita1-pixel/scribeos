const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = process.env.REDIS_URL
    ? new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
    : new IORedis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        maxRetriesPerRequest: null,
    });

const feedbackQueue = new Queue('feedback-analysis', { connection });

module.exports = { connection, feedbackQueue };