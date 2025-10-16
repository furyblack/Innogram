import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Добавляем свойство user в интерфейс Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Получаем токен из заголовка Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authHeader.split(" ")[1];

  try {
    // 2. Проверяем токен
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-default-secret-key"
    );

    // 3. Если токен валиден, записываем данные из него в req.user
    req.user = decoded;

    // 4. Передаем управление следующему обработчику
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
