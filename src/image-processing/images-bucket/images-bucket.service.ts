import { Inject, Injectable } from '@nestjs/common';
import aws from 'src/config/aws';
import s3Buckets from 'src/config/s3-buckets';
import { ConfigType } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import crypto from 'crypto';

@Injectable()
export class ImagesBucketService {
  constructor(
    @Inject(s3Buckets.KEY)
    private s3BucketsConfig: ConfigType<typeof s3Buckets>,
    @Inject(aws.KEY)
    private awsConfig: ConfigType<typeof aws>,
  ) {}

  async storePublic(dataBuffer: Buffer, fileName: string) {
    if (!this.s3BucketsConfig.imagesPublicBucket) {
      throw new Error('Internal error');
    }

    return await this.upload(
      dataBuffer,
      fileName,
      this.s3BucketsConfig.imagesPublicBucket,
    );
  }

  async storePrivate(dataBuffer: Buffer, fileName: string) {
    if (!this.s3BucketsConfig.imagesPublicBucket) {
      throw new Error('Internal error');
    }

    return await this.upload(
      dataBuffer,
      fileName,
      this.s3BucketsConfig.imagesPublicBucket,
    );
  }

  private async upload(
    dataBuffer: Buffer,
    fileName: string,
    bucketName: string,
  ) {
    console.log(fileName);
    const s3Client = new S3({
      accessKeyId: this.awsConfig.accessKeyId,
      secretAccessKey: this.awsConfig.secretAccessKey,
    });
    return await s3Client
      .upload({
        Bucket: bucketName,
        Body: dataBuffer,
        Key: `${crypto.randomUUID().substring(0, 8)}-${fileName}`,
      })
      .promise();
  }
}
