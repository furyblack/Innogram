import { AppDataSource } from '../db';
import { User } from '../entities/user.entity';
import { Account, AuthProvider } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';
import * as bcrypt from 'bcrypt';
import { Repository, EntityManager } from 'typeorm';

// Кастомная ошибка (если еще нет)
class ConflictError extends Error {
    public status: number;
    constructor(message: string) {
        super(message);
        this.status = 409;
    }
}
class InternalError extends Error {
    public status: number;
    constructor(
        message: string,
        public internalMessage?: string
    ) {
        super(message);
        this.status = 500;
    }
}

export class AuthService {
    // ---
    // ✅ РЕШЕНИЕ:
    // Мы используем геттеры, чтобы репозитории запрашивались
    // только когда они нужны (к этому моменту AppDataSource УЖЕ будет инициализирован)
    // ---
    private get userRepository(): Repository<User> {
        return AppDataSource.getRepository(User);
    }

    private get accountRepository(): Repository<Account> {
        return AppDataSource.getRepository(Account);
    }

    private get profileRepository(): Repository<Profile> {
        return AppDataSource.getRepository(Profile);
    }

    private get entityManager(): EntityManager {
        return AppDataSource.manager;
    }

    // signUpDto приходит из core-service (с email, password, username, display_name, birthday)
    async registerUser(signUpDto: any) {
        // 1. Проверка на дубликаты
        const existingAccount = await this.accountRepository.findOne({
            where: { email: signUpDto.email },
        });
        if (existingAccount) {
            throw new ConflictError('User with this email already exists');
        }

        const existingProfile = await this.profileRepository.findOne({
            where: { username: signUpDto.username },
        });
        if (existingProfile) {
            throw new ConflictError('Username is already taken');
        }

        // 2. Хэш
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

        // 3. 🔥 ТРАНЗАКЦИЯ (теперь она будет работать)
        let createdUser: User;
        try {
            await this.entityManager.transaction(async (manager) => {
                // 3.1. Создаем User
                const userRepo = manager.getRepository(User);
                const newUser = userRepo.create({
                    // role, disabled - по умолчанию из entity
                });
                await userRepo.save(newUser);
                createdUser = newUser; // Сохраняем для токенов

                // 3.2. Создаем Account
                const accountRepo = manager.getRepository(Account);
                const newAccount = accountRepo.create({
                    email: signUpDto.email,
                    password_hash: hashedPassword,
                    provider: AuthProvider.LOCAL,
                    user: newUser, // Связываем!
                    user_id: newUser.id, // Явно
                });
                await accountRepo.save(newAccount);

                // 3.3. Создаем Profile
                const profileRepo = manager.getRepository(Profile);
                const newProfile = profileRepo.create({
                    username: signUpDto.username,
                    display_name: signUpDto.display_name,
                    birthday: signUpDto.birthday,
                    user: newUser, // Связываем!
                    user_id: newUser.id, // Явно
                });
                await profileRepo.save(newProfile);
            });
        } catch (error) {
            throw new InternalError(
                'Registration failed during transaction',
                error.message
            );
        }

        // 4. Генерируем токены (на основе createdUser.id)
        // const tokens = this.tokenService.generateTokens({ userId: createdUser.id });

        // 5. Сохраняем в Redis
        // await this.redisService.saveToken(createdUser.id, tokens.refreshToken);

        // 6. Возвращаем токены
        // return tokens;

        // ЗАГЛУШКА (пока нет токенов):
        return {
            accessToken: 'temp_access_token_from_auth_service',
            refreshToken: 'temp_refresh_token_from_auth_service',
        };
    }

    // TODO: Добавить логику логина
    // async login(loginDto: any) { ... }
}

// Экспортируем один инстанс, это по-прежнему нормально
export const authService = new AuthService();
