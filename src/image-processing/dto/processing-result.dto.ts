import { ApiProperty } from '@nestjs/swagger';

export class ProcessingResultDto {
  @ApiProperty({
    description: 'The processed image output.',
    type: 'string',
    format: 'binary',
  })
  output: Buffer;

  @ApiProperty({
    description: 'The filename of the processed image.',
    example: 'myimage_processed.jpg',
  })
  fileName: string;

  @ApiProperty({
    description: 'The mimetype of the processed image.',
    example: 'image/png',
  })
  mime: string;

  @ApiProperty({
    description: 'The AWS Bucket location of the processed image.',
    example: 'https://mybucket.s3.amazonaws.com/myimage_processed.jpg',
  })
  bucketLocation?: string;
}
