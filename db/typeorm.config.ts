import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ? process.env.DB_PORT : '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  type: 'postgres',
  database: process.env.DB_NAME || 'image-processing',
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
