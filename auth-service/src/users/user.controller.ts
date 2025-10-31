import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
    public static async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, username } = req.body;
            const { accessToken, refreshToken } =
                await UserService.registerUser(
                    email,
                    password,
                    username // <-- Передаем как отдельные аргументы
                );
            res.status(201).json({ accessToken, refreshToken });
        } catch (error: any) {
            res.status(409).json({ error: error.message });
        }
    }

    public static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await UserService.login(
                email,
                password
            );
            res.status(200).json({ accessToken, refreshToken });
        } catch (error: any) {
            res.status(401).json({ error: error.message }); // 401 - Unauthorized
        }
    }

    public static async getMe(req: Request, res: Response): Promise<void> {
        res.status(200).json({ user: req.user });
    }
}
