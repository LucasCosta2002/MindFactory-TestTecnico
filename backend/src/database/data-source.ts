import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    ssl: process.env.DATABASE_SSL !== 'false',
    logging: false,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
    synchronize: false,
});
