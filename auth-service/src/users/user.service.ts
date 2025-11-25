import { AppDataSource } from '../db';
import { User } from '../entities/user.entity';
import { Account, AuthProvider } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';
import * as bcrypt from 'bcrypt';
import { Repository, EntityManager } from 'typeorm';
import { tokenService } from '../services/token.service';
import { SocialLoginDto } from './dto/social-login.dto';
import { v4 as uuidv4 } from 'uuid';

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
    avatarUrl?: string;
}

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
    // вердикт в эксперсс это норм
    public static async registerUser(signUpDto: SignUpDto): Promise<any> {
        const serviceInstance = new UserService();
        return serviceInstance.register(signUpDto);
    }

    public static async login(loginDto: LoginDto): Promise<any> {
        const serviceInstance = new UserService();
        return serviceInstance.signIn(loginDto);
    }

    public static async socialLogin(dto: SocialLoginDto): Promise<any> {
        const service = new UserService();
        return service.handleSocialLogin(dto);
    }

    private async handleSocialLogin(dto: SocialLoginDto) {
        let account = await this.accountRepository.findOne({
            where: {
                email: dto.email,
                provider: dto.provider as any,
            },
            relations: ['user'],
        });

        let user: User;

        if (!account) {
            await this.entityManager.transaction(async (manager) => {
                // А. Создаем User
                const userRepo = manager.getRepository(User);
                user = userRepo.create({}); // role по умолчанию User
                await userRepo.save(user);

                const randomPassword = uuidv4();
                const randomHash = await bcrypt.hash(randomPassword, 10);

                // Б. Создаем Account (без пароля, но с providerId)
                const accountRepo = manager.getRepository(Account);
                const newAccount = accountRepo.create({
                    email: dto.email,
                    provider: dto.provider as any,
                    passwordHash: randomHash,
                    user: user,
                    userId: user.id,
                });
                await accountRepo.save(newAccount);

                // В. Создаем Profile
                const profileRepo = manager.getRepository(Profile);
                const newProfile = profileRepo.create({
                    userName: dto.username,
                    displayName: dto.displayName,
                    avatarUrl: dto.avatarUrl,
                    user: user,
                    userId: user.id,
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
            where: { userName: signUpDto.username },
        });
        if (existingProfile) {
            throw new ConflictError('Username is already taken');
        }

        // 2. Хэш
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

        // 🔥 ТРАНЗАКЦИЯ
        try {
            const createdUser = await this.entityManager.transaction(
                async (manager) => {
                    // 3.1. Создаем User
                    const userRepo = manager.getRepository(User);
                    const newUser = userRepo.create({});
                    await userRepo.save(newUser);

                    // 3.2. Создаем Account
                    const accountRepo = manager.getRepository(Account);
                    const newAccount = accountRepo.create({
                        email: signUpDto.email,
                        passwordHash: hashedPassword,
                        provider: AuthProvider.LOCAL,
                        user: newUser,
                        userId: newUser.id, //
                    });
                    await accountRepo.save(newAccount);

                    // 3.3. Создаем Profile
                    const profileRepo = manager.getRepository(Profile);
                    const newProfile = profileRepo.create({
                        userName: signUpDto.username,
                        displayName: signUpDto.display_name,
                        birthday: signUpDto.birthday,
                        user: newUser,
                        userId: newUser.id,
                        avatarUrl: signUpDto.avatarUrl,
                    });
                    await profileRepo.save(newProfile);
                    return newUser;
                }
            );

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
            console.error(error);
            throw new InternalError(
                'Registration failed during transaction',
                error.message
            );
        }
    }

    private async signIn(loginDto: LoginDto) {
        // ✅ 1. Найти account по email
        const account = await this.accountRepository.findOne({
            where: { email: loginDto.email },
            relations: ['user'],
        });

        if (!account) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // ✅ 2. Сравнить хэши
        const isMatch = await bcrypt.compare(
            loginDto.password,
            account.passwordHash
        );
        if (!isMatch) {
            throw new UnauthorizedError('Invalid credentials');
        }

        if (!account.user) {
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

    public static async logout(userId: string): Promise<void> {
        // Удаляем токен из Redis
        await tokenService.removeRefreshToken(userId);
    }
}
