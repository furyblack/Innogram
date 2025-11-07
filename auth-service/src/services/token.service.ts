import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { redisClient } from '../redis'; // Импортируем наш redis-клиент
import { v4 as uuidv4 } from 'uuid'; // Для уникальных ID рефреш-токенов

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your_access_secret_key';
const REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key';

interface TokenPayload {
    userId: string; // Мы будем использовать User.id (UUID)
}

class TokenService {
    /**
     * Генерирует новую пару токенов (Access и Refresh).
     */
    generateTokens(payload: TokenPayload) {
        const accessToken = jwt.sign(payload, ACCESS_SECRET, {
            expiresIn: '15m',
        });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
            expiresIn: '30d',
        });
        return { accessToken, refreshToken };
    }

    /**
     * Сохраняет Refresh Token в Redis.
     * Ключ - это ID токена, значение - User ID.
     * @param userId - ID пользователя
     * @param refreshToken - Сам Refresh Token
     */
    async saveRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<void> {
        // Мы будем хранить токен под его ID (JTI), но для простоты
        // пока будем использовать сам токен как ключ (это не очень безопасно, но для старта сойдет).
        // Правильнее было бы использовать ID из `jwt.sign({ ... jti: uuidv4() })`

        // Ключ будет `refresh_tokens:USER_ID`
        // Значение - `REFRESH_TOKEN`
        // Срок жизни - 30 дней (в секундах)
        try {
            await redisClient.set(`refresh_tokens:${userId}`, refreshToken, {
                EX: 30 * 24 * 60 * 60, // 30 дней
            });
        } catch (e) {
            console.error('Failed to save token to Redis', e);
        }
    }

    // ... (здесь будут методы validateAccessToken, validateRefreshToken и т.д.)
}

export const tokenService = new TokenService();
