import { AppDataSource } from '../db';
import { User } from '../entities/user.entity';
import { Account, AuthProvider } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';
import * as bcrypt from 'bcrypt';
import { Repository, EntityManager } from 'typeorm';

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

// ПРЕДПОЛАГАЮ, ЧТО ТВОЙ DTO ВЫГЛЯДИТ ТАК
interface SignUpDto {
    email: string;
    password: string;
    username: string;
    display_name: string;
    birthday: string;
}

export class UserService {
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

    // Твой контроллер вызывает статический метод, так что
    // нам нужно создать инстанс внутри или сделать сервис инстансом.
    // Давай пока оставим static, но будем создавать инстанс:

    // ЭТОТ МЕТОД ВЫЗЫВАЕТ ТВОЙ КОНТРОЛЛЕР
    public static async registerUser(signUpDto: SignUpDto): Promise<any> {
        // Создаем инстанс, чтобы получить доступ к геттерам
        const serviceInstance = new UserService();
        return serviceInstance.register(signUpDto);
    }

    // (Логика для логина)
    public static async login(loginDto: any): Promise<any> {
        const serviceInstance = new UserService();
        return serviceInstance.signIn(loginDto);
    }

    // ---
    // РЕАЛЬНАЯ ЛОГИКА РЕГИСТРАЦИИ (теперь не-static)
    // ---
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

        // 3. 🔥 ТРАНЗАКЦИЯ
        let createdUser: User;
        try {
            await this.entityManager.transaction(async (manager) => {
                // 3.1. Создаем User
                const userRepo = manager.getRepository(User);
                const newUser = userRepo.create({
                    // role, disabled - по умолчанию из entity
                });
                await userRepo.save(newUser);
                createdUser = newUser;

                // 3.2. Создаем Account
                const accountRepo = manager.getRepository(Account);
                const newAccount = accountRepo.create({
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
                    username: signUpDto.username,
                    display_name: signUpDto.display_name,
                    birthday: signUpDto.birthday,
                    user: newUser,
                    user_id: newUser.id,
                });
                await profileRepo.save(newProfile);
            });
        } catch (error) {
            console.error(error); // Посмотрим на реальную ошибку
            throw new InternalError(
                'Registration failed during transaction',
                error.message
            );
        }

        if (!createdUser) {
            throw new InternalError('User was not created');
        }

        // ЗАГЛУШКА (пока нет токенов):
        return {
            accessToken: 'temp_access_token',
            refreshToken: 'temp_refresh_token',
        };
    }

    private async signIn(loginDto: any) {
        // TODO:
        // 1. Найти account по email:
        // const account = await this.accountRepository.findOne({ where: { email: loginDto.email } });
        // if (!account) throw new Error('User not found');
        // 2. Сравнить хэши:
        // const isMatch = await bcrypt.compare(loginDto.password, account.password_hash);
        // if (!isMatch) throw new Error('Invalid credentials');
        // 3. Вернуть токены, используя account.user_id

        return {
            accessToken: 'temp_login_token',
            refreshToken: 'temp_login_refresh',
        };
    }
}
