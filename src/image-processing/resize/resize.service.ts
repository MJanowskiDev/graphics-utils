import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ImagesBucketService } from '../images-bucket/images-bucket.service';
import { OperationData } from '../entity';
import { OperationType } from '../types';
import { OperationDataRepository } from '../repository';

@Injectable()
export class ResizeService {
  constructor(
    private imagesBucketService: ImagesBucketService,
    private operationDataRepository: OperationDataRepository,
  ) {}
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

      const operationData = new OperationData();
      operationData.type = OperationType.resize;
      operationData.userParams = JSON.stringify({ width, fileName });
      await this.operationDataRepository.create(operationData);

      return buffer;
    } catch (error) {
      throw error;
    }
  }
}
