import { Inject, Injectable } from '@nestjs/common';
import aws from '../../config/aws';
import s3Buckets from '../../config/s3-buckets';
import { ConfigType } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import crypto from 'crypto';
import { Asset } from '../entity';
import { AssetRepository } from '../repository';

@Injectable()
export class ImagesBucketService {
  private readonly s3Client: S3;

  constructor(
    @Inject(s3Buckets.KEY)
    private s3BucketsConfig: ConfigType<typeof s3Buckets>,
    @Inject(aws.KEY)
    private awsConfig: ConfigType<typeof aws>,
    private assetRepository: AssetRepository,
  ) {
    this.s3Client = new S3(this.awsConfig);
  }

  async storePublic(
    dataBuffer: Buffer,
    fileName: string,
    assetId: number,
  ): Promise<void> {
    const uploadResult = await this.uploadToS3(
      dataBuffer,
      fileName,
      this.s3BucketsConfig.imagesPublicBucket,
    );
    await this.assetRepository.setOutputLink(assetId, uploadResult.Location);
  }

  async storePrivate(
    dataBuffer: Buffer,
    fileName: string,
  ): Promise<{ assetId: number }> {
    const uploadResult = await this.uploadToS3(
      dataBuffer,
      fileName,
      this.s3BucketsConfig.imagesPrivateBucket,
    );

    const asset = new Asset();
    asset.sourceLink = uploadResult.Location;
    const { id } = await this.assetRepository.create(asset);

    return { assetId: id };
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
