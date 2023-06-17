import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ImagesBucketService } from '../images-bucket/images-bucket.service';

@Injectable()
export class ResizeService {
  constructor(private imagesBucketService: ImagesBucketService) {}
  async resize(inputBuffer: Buffer, width: number): Promise<Buffer> {
    try {
      this.imagesBucketService.removeMe();
      return await sharp(inputBuffer).resize({ width }).toBuffer();
    } catch (error) {
      throw error;
    }
  }
}
