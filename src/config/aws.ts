import { registerAs } from '@nestjs/config';
export default registerAs('aws', () => ({
  accessKey: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_ID,
}));
