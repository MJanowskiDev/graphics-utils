import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ImageProcessing } from '../entity';
import { OperationType } from '../types';

@Injectable()
export class ImageProcessingRepository {
  constructor(
    @InjectRepository(ImageProcessing)
    private readonly imageProcessingRepository: Repository<ImageProcessing>,
  ) {}

  create(operationData: ImageProcessing) {
    return this.imageProcessingRepository.save(operationData);
  }

  async save(type: OperationType, bucketLocation = '', userParams = {}) {
    const operationData = new ImageProcessing();
    operationData.type = type;
    operationData.userParams = JSON.stringify(userParams);
    operationData.outputLink = bucketLocation;

    return await this.imageProcessingRepository.save(operationData);
  }
}
