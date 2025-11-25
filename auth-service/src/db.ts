import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Account } from './entities/account.entity';
import { Profile } from './entities/profile.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',

    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    entities: [User, Account, Profile],

    synchronize: process.env.NODE_ENV === 'development',

    logging: true,
});
