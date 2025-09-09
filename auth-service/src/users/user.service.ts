import pool from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./user.interface";

export class UserService {
  public static async register(
    userData: Omit<User, "id">
  ): Promise<Omit<User, "password">> {
    // В коде мы по-прежнему можем называть переменную 'name', но в БД будем использовать 'username'
    const { name, email, password } = userData;

    // 1. Проверяем, не занят ли email, используя правильное имя таблицы "user"
    const existingUser = await pool.query(
      'SELECT * FROM "user" WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      throw new Error("User with this email already exists.");
    }

    // 2. Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Сохраняем пользователя, используя правильные имена таблицы и полей
    const newUserResult = await pool.query(
      'INSERT INTO "user" (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [name, email, hashedPassword]
    );

    // Переименуем 'username' в 'name' для консистентности ответа
    const userToReturn = {
      ...newUserResult.rows[0],
      name: newUserResult.rows[0].username,
    };
    delete userToReturn.username;

    return userToReturn;
  }

  public static async login(
    loginData: Pick<User, "email" | "password">
  ): Promise<{ user: Omit<User, "password">; accessToken: string }> {
    const { email, password } = loginData;

    // 1. Ищем пользователя по email в таблице "user"
    const userResult = await pool.query(
      'SELECT * FROM "user" WHERE email = $1',
      [email]
    );
    if (userResult.rows.length === 0) {
      throw new Error("Invalid credentials.");
    }
    const user = userResult.rows[0];

    // 2. Сравниваем пароль с хешем из поля "password_hash"
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    // 3. Создаем JWT токен
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-default-secret-key",
      { expiresIn: "1h" }
    );

    // Удаляем хеш пароля из объекта пользователя перед отправкой
    delete user.password_hash;

    // Переименуем 'username' в 'name' для консистентности ответа
    user.name = user.username;
    delete user.username;

    return { user, accessToken };
  }
}
