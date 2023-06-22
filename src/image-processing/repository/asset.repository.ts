import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from '../entity/asset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssetRepository {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  create(asset: Asset) {
    return this.assetRepository.save(asset);
  }

  setOutputLink(assetId: number, outputLink: string) {
    return this.assetRepository.update(assetId, {
      outputLink,
    });
  }
}
