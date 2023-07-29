import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { registerAs } from '@nestjs/config';

export class DatabaseConfigSchema {
  @IsNotEmpty()
  @IsString()
  host: string;

  @IsNotEmpty()
  @IsNumber()
  port: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  database: string;

  @IsNotEmpty()
  @IsArray()
  entities: string[];

  @IsNotEmpty()
  @IsBoolean()
  synchronize: boolean;

  @IsNotEmpty()
  @IsBoolean()
  logging: boolean;

  @IsNotEmpty()
  @IsArray()
  migrations: string[];

  @IsNotEmpty()
  @IsString()
  migrationsTableName: string;

  constructor() {
    this.host = process.env.DB_HOST as string;
    this.port = Number(process.env.DB_PORT);
    this.username = process.env.DB_USERNAME as string;
    this.password = process.env.DB_PASSWORD as string;
    this.type = process.env.DB_TYPE || 'postgres';
    this.database = process.env.DB_NAME || 'image-processing';
    this.entities = [`${__dirname}/../**/*.entity{.ts,.js}`];
    this.synchronize = process.env.NODE_ENV === 'development';
    this.logging = process.env.NODE_ENV === 'development';
    this.migrations = [`${__dirname}/../db/migrations/*{.ts,.js}`];
    this.migrationsTableName = 'migrations';
  }
}

export const databaseConfig = registerAs(
  'database',
  () => new DatabaseConfigSchema(),
);
