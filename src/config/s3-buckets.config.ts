import { IsString, IsNotEmpty } from 'class-validator';
import { registerAs } from '@nestjs/config';

export class S3BucketsConfigSchema {
  @IsNotEmpty()
  @IsString()
  imagesPrivateBucket: string;

  @IsNotEmpty()
  @IsString()
  imagesPublicBucket: string;

  @IsNotEmpty()
  @IsString()
  region: string;

  constructor() {
    this.imagesPrivateBucket = process.env.S3_BUCKET_IMAGES_PRIVATE as string;
    this.imagesPublicBucket = process.env.S3_BUCKET_IMAGES_PUBLIC as string;
    this.region = process.env.S3_REGION as string;
  }
}

export const s3BucketsConfig = registerAs(
  's3-buckets',
  () => new S3BucketsConfigSchema(),
);
