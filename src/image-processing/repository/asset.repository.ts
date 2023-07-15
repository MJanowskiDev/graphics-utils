import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Asset } from '../entity';

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
