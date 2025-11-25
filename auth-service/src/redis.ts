import { createClient } from 'redis';

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
    if (!redisClient.isReady) {
        console.log('Connecting to Redis...');
        await redisClient.connect();
        console.log('Redis connected.');
    }
};

export { redisClient, connectRedis };
