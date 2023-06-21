import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ImagesBucketService } from '../images-bucket/images-bucket.service';

@Injectable()
export class ConvertService {
  constructor(private imagesBucketService: ImagesBucketService) {}

  async convertToFormat(
    inputBuffer: Buffer,
    format: keyof sharp.FormatEnum,
    fileName: string,
  ): Promise<{ buffer: Buffer; fileName: string; mime: string }> {
    const outputFilename = `converted_${fileName.split('.')[0]}.${format}`;
    const mime = `image/${format}`;

    const { assetId } = await this.imagesBucketService.storePrivate(
      inputBuffer,
      outputFilename,
    );
    const buffer = await sharp(inputBuffer).toFormat(format).toBuffer();
    await this.imagesBucketService.storePublic(buffer, outputFilename, assetId);

    return { buffer, fileName: outputFilename, mime };
  }
}
