import { registerAs } from '@nestjs/config';
export default registerAs('database', () => ({
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbType: process.env.DB_TYPE || 'postgres',
  dbName: process.env.DB_NAME || 'image-processing',
}));
