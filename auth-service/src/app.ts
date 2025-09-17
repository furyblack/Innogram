import express, { Request, Response } from "express";
import cors from "cors"; // 👈 1. Импортируй cors
import { errorHandler } from "./middleware/error.middleware";
import userRoutes from "./users/user.routes";

const app = express();

// 👇 2. Настрой cors СРАЗУ ПОСЛЕ express.json() и ПЕРЕД твоими роутами
app.use(
  cors({
    origin: "http://localhost:1024", // Разрешаем запросы только с этого адреса
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("✅ Auth Service is running! Hot-reload РАБОТАЕТ! 🔥");
});

app.use("/api/auth", userRoutes);

//глобальный обработчик ошибок
app.use(errorHandler);

export default app;
