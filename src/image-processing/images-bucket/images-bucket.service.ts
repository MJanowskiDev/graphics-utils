import { Inject, Injectable } from '@nestjs/common';
import aws from 'src/config/aws';
import s3Buckets from 'src/config/s3-buckets';
import { ConfigType } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import crypto from 'crypto';

@Injectable()
export class ImagesBucketService {
  private readonly s3Client: S3;

  constructor(
    @Inject(s3Buckets.KEY)
    private s3BucketsConfig: ConfigType<typeof s3Buckets>,
    @Inject(aws.KEY)
    private awsConfig: ConfigType<typeof aws>,
  ) {
    this.s3Client = new S3(this.awsConfig);
  }

  storePublic(
    dataBuffer: Buffer,
    fileName: string,
  ): Promise<S3.ManagedUpload.SendData> {
    return this.uploadToS3(
      dataBuffer,
      fileName,
      this.s3BucketsConfig.imagesPublicBucket,
    );
  }

  storePrivate(
    dataBuffer: Buffer,
    fileName: string,
  ): Promise<S3.ManagedUpload.SendData> {
    return this.uploadToS3(
      dataBuffer,
      fileName,
      this.s3BucketsConfig.imagesPrivateBucket,
    );
  }

  private async uploadToS3(
    dataBuffer: Buffer,
    fileName: string,
    bucketName: string | undefined,
  ): Promise<S3.ManagedUpload.SendData> {
    if (!bucketName) {
      throw new Error('Invalid S3 bucket configuration');
    }
    const uniqueFileName = this.generateUniqueFileName(fileName);
    const uploadParams: S3.Types.PutObjectRequest = {
      Bucket: bucketName,
      Body: dataBuffer,
      Key: uniqueFileName,
    };
    return this.s3Client.upload(uploadParams).promise();
  }

  private generateUniqueFileName(
    originalFileName: string,
    substringStart = 0,
    substringEnd = 8,
  ): string {
    const uniqueId = crypto
      .randomUUID()
      .substring(substringStart, substringEnd);
    return `${uniqueId}-${originalFileName}`;
  }
}
