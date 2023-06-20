import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ImagesBucketService } from '../images-bucket/images-bucket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from '../asset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResizeService {
  constructor(
    private imagesBucketService: ImagesBucketService,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}
  async resize(
    inputBuffer: Buffer,
    width: number,
    fileName: string,
  ): Promise<Buffer> {
    try {
      const asset = new Asset();
      const sourceLink = await this.imagesBucketService.storePrivate(
        inputBuffer,
        fileName,
      );
      asset.sourceLink = sourceLink.Location;

      const { id } = await this.assetRepository.save(asset);

      const buffer = await sharp(inputBuffer).resize({ width }).toBuffer();
      const publicLink = await this.imagesBucketService.storePublic(
        buffer,
        fileName,
      );

      await this.assetRepository.update(id, {
        outputLink: publicLink.Location,
      });

      return buffer;
    } catch (error) {
      throw error;
    }
  }
}
