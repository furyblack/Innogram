import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { redisClient } from '../redis'; 
import { v4 as uuidv4 } from 'uuid'; 

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your_access_secret_key';
const REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key';

interface TokenPayload {
    userId: string; 
}

class TokenService {
    
    generateTokens(payload: TokenPayload) {
        const accessToken = jwt.sign(payload, ACCESS_SECRET, {
            expiresIn: '15m',
        });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
            expiresIn: '30d',
        });
        return { accessToken, refreshToken };
    }


    async saveRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<void> {
        
        try {
            await redisClient.set(`refresh_tokens:${userId}`, refreshToken, {
                EX: 30 * 24 * 60 * 60, 
            });
        } catch (e) {
            console.error('Failed to save token to Redis', e);
        }
    }

    async removeRefreshToken(userId: string): Promise<void> {
        try {
            await redisClient.del(`refresh_tokens:${userId}`);
        } catch (e) {
            console.error('Failed to remove token from Redis', e);
        }
    }
 
}

export const tokenService = new TokenService();
