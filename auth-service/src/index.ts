import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config(); // 1. Конфиг .env - в самом верху!

import app from './app'; // 2. Импортируем "двигатель"
import { AppDataSource } from './db'; // 3. Импортируем наш TypeORM DataSource
import { connectRedis } from './redis'; // 4. Импортируем коннектор Redis

const PORT = parseInt(process.env.PORT || '4000', 10);

async function bootstrap() {
    try {
        // 1. Подключаемся к Redis
        await connectRedis();

        // 2. Подключаемся к PostgreSQL через TypeORM
        // (Это заменило твой checkDbConnection)
        await AppDataSource.initialize();
        console.log('✅ Auth Service: TypeORM (DataSource) connected.');

        // 3. Если ОБА подключения успешны, запускаем Express
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Auth Service (Express) running on port ${PORT}`);
        });
    } catch (err) {
        // Если любая из инициализаций (Redis или Postgres) упадет,
        // сервер не запустится.
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

// Запускаем!
bootstrap();
