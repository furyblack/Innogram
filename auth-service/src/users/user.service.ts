import { AppDataSource } from '../db';
import { User } from '../entities/user.entity';
import { Account, AuthProvider } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';
import * as bcrypt from 'bcrypt';
import { Repository, EntityManager } from 'typeorm';
import { tokenService } from '../services/token.service';
import { SocialLoginDto } from './dto/social-login.dto';

// Кастомная ошибка
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

class UnauthorizedError extends Error {
    public status: number;
    constructor(message: string) {
        super(message);
        this.status = 401;
    }
}

interface SignUpDto {
    email: string;
    password: string;
    username: string;
    display_name: string;
    birthday: string;
}

// <-- ИСПРАВЛЕНО 3: Добавлен DTO для логина вместо 'any'
interface LoginDto {
    email: string;
    password: string;
}

export class UserService {
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

    // todo: разобраться, нет ли проблем с тем что создается экземпляр класса каждый раз (не депенденси инжекшн)
    public static async registerUser(signUpDto: SignUpDto): Promise<any> {
        const serviceInstance = new UserService();
        return serviceInstance.register(signUpDto);
    }

    // <-- ИСПРАВЛЕНО 3: Используем LoginDto
    public static async login(loginDto: LoginDto): Promise<any> {
        const serviceInstance = new UserService();
        return serviceInstance.signIn(loginDto);
    }

    public static async socialLogin(dto: SocialLoginDto): Promise<any> {
        const service = new UserService();
        return service.handleSocialLogin(dto);
    }

    private async handleSocialLogin(dto: SocialLoginDto) {
        // 1. Ищем аккаунт по provider + email
        // Важно: ищем именно в таблице Account
        let account = await this.accountRepository.findOne({
            where: {
                email: dto.email,
                provider: dto.provider as any, // 'google'
            },
            relations: ['user'],
        });

        let user: User;

        // 2. Если аккаунта нет - это РЕГИСТРАЦИЯ
        if (!account) {
            // Тут нужна проверка: а вдруг такой email уже занят 'local' провайдером?
            // Для простоты пока опустим слияние аккаунтов, но в идеале надо проверить.

            // НАЧИНАЕМ ТРАНЗАКЦИЮ
            await this.entityManager.transaction(async (manager) => {
                // А. Создаем User
                const userRepo = manager.getRepository(User);
                user = userRepo.create({}); // role по умолчанию User
                await userRepo.save(user);

                // Б. Создаем Account (без пароля, но с providerId)
                const accountRepo = manager.getRepository(Account);
                const newAccount = accountRepo.create({
                    email: dto.email,
                    provider: dto.provider as any,
                    password_hash: 'social_login_no_pass', // Заглушка, т.к. пароля нет
                    user: user,
                    user_id: user.id,
                    // В сущность Account стоит добавить поле providerId, если его нет,
                    // но пока можно без него, уникальность по email+provider
                });
                await accountRepo.save(newAccount);

                // В. Создаем Profile
                const profileRepo = manager.getRepository(Profile);
                const newProfile = profileRepo.create({
                    username: dto.username, // Придет сгенерированный
                    display_name: dto.displayName,
                    avatar_url: dto.avatarUrl,
                    user: user,
                    user_id: user.id,
                });
                await profileRepo.save(newProfile);
            });
        } else {
            // 3. Если аккаунт есть - это ВХОД
            if (!account.user) {
                throw new InternalError('Orphaned account found');
            }
            user = account.user;
        }

        // 4. Генерируем токены
        const tokens = tokenService.generateTokens({ userId: user!.id });
        await tokenService.saveRefreshToken(user!.id, tokens.refreshToken);

        return tokens;
    }

    private async register(signUpDto: SignUpDto) {
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

        // 🔥 ТРАНЗАКЦИЯ
        try {
            // Просто присваиваем результат транзакции
            const createdUser = await this.entityManager.transaction(
                async (manager) => {
                    // 3.1. Создаем User
                    const userRepo = manager.getRepository(User);
                    const newUser = userRepo.create({
                        // role, disabled - по умолчанию
                    });
                    await userRepo.save(newUser);

                    // 3.2. Создаем Account
                    const accountRepo = manager.getRepository(Account);
                    const newAccount = accountRepo.create({
                        // <-- ИСПРАВЛЕНО 2: Здесь были пропущены данные
                        email: signUpDto.email,
                        password_hash: hashedPassword,
                        provider: AuthProvider.LOCAL,
                        user: newUser,
                        user_id: newUser.id,
                    });
                    await accountRepo.save(newAccount);

                    // 3.3. Создаем Profile
                    const profileRepo = manager.getRepository(Profile);
                    const newProfile = profileRepo.create({
                        // <-- ИСПРАВЛЕНО 2: Здесь были пропущены данные
                        username: signUpDto.username,
                        display_name: signUpDto.display_name,
                        birthday: signUpDto.birthday,
                        user: newUser,
                        user_id: newUser.id,
                    });
                    await profileRepo.save(newProfile);

                    // 3.4. Возвращаем созданного юзера ИЗ КОЛЛБЭКА
                    return newUser;
                }
            );

            // Теперь TypeScript СЧАСТЛИВ.
            // Он знает, что 'createdUser' имеет тип 'User'

            // ✅ 4. Генерируем НАСТОЯЩИЕ токены
            const tokens = tokenService.generateTokens({
                userId: createdUser.id,
            });

            // ✅ 5. Сохраняем Refresh Token в Redis
            await tokenService.saveRefreshToken(
                createdUser.id,
                tokens.refreshToken
            );

            // ✅ 6. Возвращаем токены
            return tokens;
        } catch (error) {
            console.error(error); // Посмотрим на реальную ошибку
            throw new InternalError(
                'Registration failed during transaction',
                error.message
            );
        }
    }

    // <-- ИСПРАВЛЕНО 3: Используем LoginDto вместо 'any'
    private async signIn(loginDto: LoginDto) {
        // ✅ 1. Найти account по email
        const account = await this.accountRepository.findOne({
            where: { email: loginDto.email },
            relations: ['user'], // <-- ВАЖНО: загружаем связь с user
        });

        if (!account) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // ✅ 2. Сравнить хэши
        const isMatch = await bcrypt.compare(
            loginDto.password,
            account.password_hash
        );
        if (!isMatch) {
            throw new UnauthorizedError('Invalid credentials');
        }

        if (!account.user) {
            // Такого быть не должно, но на всякий случай
            throw new InternalError('Account is not linked to a user');
        }

        // ✅ 3. Генерируем НАСТОЯЩИЕ токены, используя account.user_id
        const tokens = tokenService.generateTokens({ userId: account.user.id });

        // ✅ 4. Сохраняем Refresh Token в Redis
        await tokenService.saveRefreshToken(
            account.user.id,
            tokens.refreshToken
        );

        // ✅ 5. Возвращаем токены
        return tokens;
    }
}
