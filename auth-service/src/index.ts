import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { AppDataSource } from './db';
import { connectRedis } from './utils/redis-client';

const PORT = parseInt(process.env.PORT || '4000', 10);

async function bootstrap() {
    try {
        await connectRedis();
        await AppDataSource.initialize();
        console.log('✅ Auth Service: TypeORM (DataSource) connected.');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Auth Service (Express) running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

bootstrap();
