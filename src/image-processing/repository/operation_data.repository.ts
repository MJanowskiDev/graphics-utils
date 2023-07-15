import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OperationData } from '../entity';

@Injectable()
export class OperationDataRepository {
  constructor(
    @InjectRepository(OperationData)
    private readonly operationDataRepository: Repository<OperationData>,
  ) {}

  create(operationData: OperationData) {
    return this.operationDataRepository.save(operationData);
  }
}
