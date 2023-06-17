import { Inject, Injectable } from '@nestjs/common';
import aws from 'src/config/aws';
import s3Buckets from 'src/config/s3-buckets';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class ImagesBucketService {
  constructor(
    @Inject(s3Buckets.KEY)
    private s3BucketsConfig: ConfigType<typeof s3Buckets>,
    @Inject(aws.KEY)
    private awsConfig: ConfigType<typeof aws>,
  ) {}

  removeMe() {
    console.log(this.s3BucketsConfig, this.awsConfig);
  }
}
