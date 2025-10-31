import { createClient } from 'redis';

// 1. Создаем клиент
const redisClient = createClient({
    // URL собирается из .env, которые вы прописали в docker-compose.yml
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

// 2. Добавляем обработчик ошибок
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// 3. Подключаемся (асинхронно)
// Мы сделаем это один раз при старте приложения
const connectRedis = async () => {
    if (!redisClient.isReady) {
        console.log('Connecting to Redis...');
        await redisClient.connect();
        console.log('Redis connected.');
    }
};

// 4. Экспортируем клиент и функцию подключения
export { redisClient, connectRedis };
