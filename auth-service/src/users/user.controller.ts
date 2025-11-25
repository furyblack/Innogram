import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
    public static async register(req: Request, res: Response): Promise<void> {
        try {
            
            const { accessToken, refreshToken } =
                await UserService.registerUser(req.body);
            res.status(201).json({ accessToken, refreshToken });
        } catch (error) {
            
            const status = error.status || 400; 
            res.status(status).json({ error: error.message });
        }
    }

    public static async login(req: Request, res: Response): Promise<void> {
        try {
            const { accessToken, refreshToken } = await UserService.login(
                req.body
            );
            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            const status = error.status || 401; 
            res.status(status).json({ error: error.message });
        }
    }

    public static async socialLogin(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const tokens = await UserService.socialLogin(req.body);
            res.status(200).json(tokens);
        } catch (error) {
            const status = 500;
            res.status(status).json({
                error:
                    error instanceof Error
                        ? error.message
                        : 'Social login failed',
            });
        }
    }

    public static async logout(req: Request, res: Response): Promise<void> {
        try {
        
            const { userId } = req.body;

            await UserService.logout(userId);
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ error: 'Logout failed' });
        }
    }
}
