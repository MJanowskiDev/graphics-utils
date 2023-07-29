import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

export class AwsConfigSchema {
  @IsNotEmpty()
  @IsString()
  accessKeyId: string;

  @IsNotEmpty()
  @IsString()
  secretAccessKey: string;

  constructor() {
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
  }
}
export const awsConfig = registerAs('aws', () => new AwsConfigSchema());
