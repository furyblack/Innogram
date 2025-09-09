import express, { Request, Response } from "express";
import { errorHandler } from "./middleware/error.middleware";
import userRoutes from "./users/user.routes";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("✅ Auth Service is running!");
});

app.use("/api/auth", userRoutes);

//глобальный обработчик ошибок
app.use(errorHandler);

export default app;
