import { Request, Response } from "express";
import { UserService } from "./user.service";

// Контроллер - связующее звено между HTTP и бизнес-логикой
export class UserController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await UserService.register(req.body);
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, accessToken } = await UserService.login(req.body);
      res.status(200).json({ message: "Login successful", user, accessToken });
    } catch (error: any) {
      res.status(401).json({ error: error.message }); // 401 - Unauthorized
    }
  }
}
