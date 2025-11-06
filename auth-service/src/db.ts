import 'reflect-metadata'; // <-- 1. ОБЯЗАТЕЛЬНО импортируй это. Всегда первой строкой!
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';

// Загружаем переменные из .env файла
dotenv.config();

// 2. Создаем и конфигурируем ИСТОЧНИК ДАННЫХ (DataSource) для TypeORM
export const AppDataSource = new DataSource({
    type: 'postgres',

    // 3. Используем твои переменные окружения
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    // 4. Указываем TypeORM, какие таблицы (сущности) ему нужно знать
    entities: [User, Account, Profile],

    // 5. synchronize: true - Это для разработки.
    // Он автоматически создает/обновляет таблицы в БД по твоим .entity.ts файлам.
    // Идеально для нашего рефакторинга.
    // В production это выключают и используют "миграции".
    synchronize: process.env.NODE_ENV === 'development', // Используй true, если нет этой переменной

    // (Опционально) Включи логирование, чтобы видеть SQL-запросы в консоли
    logging: true,
});
