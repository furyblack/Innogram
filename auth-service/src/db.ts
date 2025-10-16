import { Pool } from "pg";
import * as dotenv from "dotenv";

// Загружаем переменные из .env файла (для локальной разработки)
dotenv.config();

// Создаем пул соединений, используя переменные окружения
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// Функция для проверки соединения при старте сервера
export const checkDbConnection = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Auth Service: PostgreSQL connected");
  } catch (error) {
    console.error("❌ Auth Service: Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
};

export default pool;
