import { registerAs } from '@nestjs/config';
export default registerAs('s3-buckets', () => ({
  imagesPrivateBucket: process.env.S3_BUCKET_IMAGES_PRIVATE,
  imagesPublicBucket: process.env.S3_BUCKET_IMAGES_PUBLIC,
  region: process.env.S3_REGION,
}));
