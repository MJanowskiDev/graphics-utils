import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ImagesBucketService } from '../images-bucket/images-bucket.service';

@Injectable()
export class ResizeService {
  constructor(private imagesBucketService: ImagesBucketService) {}
  async resize(
    inputBuffer: Buffer,
    width: number,
    fileName: string,
  ): Promise<Buffer> {
    try {
      const { assetId } = await this.imagesBucketService.storePrivate(
        inputBuffer,
        fileName,
      );
      const buffer = await sharp(inputBuffer).resize({ width }).toBuffer();
      await this.imagesBucketService.storePublic(buffer, fileName, assetId);

      return buffer;
    } catch (error) {
      throw error;
    }
  }
}
