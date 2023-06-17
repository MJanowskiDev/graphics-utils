import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ResizeService {
  async resize(inputBuffer: Buffer, width: number): Promise<Buffer> {
    try {
      return await sharp(inputBuffer).resize({ width }).toBuffer();
    } catch (error) {
      throw error;
    }
  }
}
