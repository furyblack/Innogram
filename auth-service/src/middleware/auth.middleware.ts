import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// Декодированный payload токена
export interface JwtPayload {
  userId: string;
  role: "admin" | "user";
}

// Расширяем Request, чтобы появился req.user
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET) as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

//roles middlewares
export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "admin") {
    return next(ApiError.forbidden("Admins only"));
  }
  next();
}

export function requireOwnerOrAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (req.user?.role !== "admin" && req.user?.userId !== id) {
    return next(ApiError.forbidden("Access denied"));
  }
  next();
}
