import * as dotenv from 'dotenv';
import app from './app';
import { checkDbConnection } from './db'; // <-- Импортируем нашу проверку
import { connectRedis } from './redis';

// Просто вызываем config() один раз. Этого достаточно.
dotenv.config();

// Порт берем из окружения, 4000 - как запасной вариант,
// т.к. в docker-compose мы настроили именно его.
const PORT = parseInt(process.env.PORT || '4000', 10);

async function bootstrap() {
    try {
        // 1. Проверяем подключение к PostgreSQL
        await connectRedis();
        await checkDbConnection();

        // 2. Если все хорошо, запускаем Express-сервер
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Auth Service running on port ${PORT}`);
        });
    } catch (err) {
        // Ошибка уже будет обработана в checkDbConnection,
        // но на всякий случай оставим общий catch
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

bootstrap();
