import { Module } from '@nestjs/common';

import { S3UploadController } from './s3-upload/s3-upload.controller';

@Module({
  controllers: [S3UploadController],
})
export class LambdaModule {}
