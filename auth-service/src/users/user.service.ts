import pool from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.interface';
import { redisClient } from '../redis';

// ПРЕДУПРЕЖДЕНИЕ: Вынесите 'секреты' в process.env!
// (Например: process.env.ACCESS_TOKEN_SECRET)
const ACCESS_SECRET = 'your-super-secret-access-key';
const REFRESH_SECRET = 'your-super-secret-refresh-key';

export class UserService {
    // ПРИМЕЧАНИЕ: Статические методы не могут быть асинхронными
    // в определении класса, но их вызов будет асинхронным.
    // Я также добавил DTO (Data Transfer Objects) для email/password.

    public static async registerUser(
        email: string,
        password: string,
        username: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        // --- ВОТ ЧТО БЫЛО ПРОПУЩЕНО (Начало) ---

        // 1. Проверяем, существует ли пользователь
        const existingUser = await pool.query(
            'SELECT * FROM "user" WHERE email = $1',
            [email]
        );
        if (existingUser.rows.length > 0) {
            throw new Error('User already exists'); // (Или ваша кастомная ошибка)
        }

        // 2. Хешируем пароль
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Создаем пользователя в БД
        const newUserResult = await pool.query(
            'INSERT INTO "user" (email, password_hash, username) VALUES ($1, $2, $3) RETURNING *', // <-- ИСПРАВЛЕНО
            [email, hashedPassword, username]
        );
        const user: User = newUserResult.rows[0];

        // 4. Генерируем ID для Refresh токена
        const refreshTokenId = uuidv4();

        // 5. Создаем токены
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            ACCESS_SECRET,
            { expiresIn: '15m' } // Короткий срок жизни для Access
        );

        const refreshToken = jwt.sign(
            { userId: user.id, jti: refreshTokenId }, // 'jti' (JWT ID) связывает токен с сессией в Redis
            REFRESH_SECRET,
            { expiresIn: '7d' } // Длинный срок жизни для Refresh
        );

        // --- ВОТ ЧТО БЫЛО ПРОПУЩЕНО (Конец) ---

        // 6. Сохраняем сессию Refresh токена в Redis
        const redisSessionKey = `refresh_tokens:${refreshTokenId}`;
        const sessionData = JSON.stringify({ userId: user.id });
        const sevenDaysInSeconds = 60 * 60 * 24 * 7;

        await redisClient.set(redisSessionKey, sessionData, {
            EX: sevenDaysInSeconds,
        });

        return { accessToken, refreshToken }; // Теперь эти переменные существуют
    }

    public static async login(
        email: string,
        password: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        // --- ВОТ ЧТО БЫЛО ПРОПУЩЕНО (Начало) ---

        // 1. Находим пользователя
        const userResult = await pool.query(
            'SELECT * FROM "user" WHERE email = $1',
            [email]
        );
        if (userResult.rows.length === 0) {
            throw new Error('Invalid credentials'); // Не говорим, что "пользователь не найден"
        }
        const user: User = userResult.rows[0];

        // 2. Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // 3. Генерируем ID для Refresh токена
        const refreshTokenId = uuidv4();

        // 4. Создаем токены
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id, jti: refreshTokenId },
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // --- ВОТ ЧТО БЫЛО ПРОПУЩЕНО (Конец) ---

        // 5. Сохраняем сессию Refresh токена в Redis
        const redisSessionKey = `refresh_tokens:${refreshTokenId}`;
        const sessionData = JSON.stringify({ userId: user.id });
        const sevenDaysInSecondsLogin = 60 * 60 * 24 * 7;

        await redisClient.set(redisSessionKey, sessionData, {
            EX: sevenDaysInSecondsLogin,
        });

        return { accessToken, refreshToken }; // Теперь все переменные на месте
    }
}
