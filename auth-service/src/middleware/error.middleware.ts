import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";

export function errorHandler(
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
}
