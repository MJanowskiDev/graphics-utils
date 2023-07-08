import { Injectable } from '@nestjs/common';
import { ProcessingResult, File, OperationType } from '../types';
import { ProcessingService } from '../processing/processing.service';
import sharp, { FormatEnum } from 'sharp';
import { ImageProcessingRepository } from '../repository';

@Injectable()
export class BasicTransformationsService {
  constructor(
    private processingService: ProcessingService,
    private imageProcessingRepository: ImageProcessingRepository,
  ) {}

  async formatConversion(
    inputFiles: File[],
    format: keyof FormatEnum,
  ): Promise<ProcessingResult> {
    return await this.processFiles(
      inputFiles,
      (b: Buffer) => sharp(b).toFormat(format),
      OperationType.formatConversion,
      { format },
    );
  }

  async resize(inputFiles: File[], width: number): Promise<ProcessingResult> {
    return await this.processFiles(
      inputFiles,
      (b: Buffer) => sharp(b).resize({ width }),
      OperationType.resize,
      { width },
    );
  }

  async toGrayscale(inputFiles: File[]): Promise<ProcessingResult> {
    return await this.processFiles(
      inputFiles,
      (b: Buffer) => sharp(b).grayscale(true),
      OperationType.toGrayscale,
    );
  }

  private async processFiles(
    inputFiles: File[],
    algorithm: (buffer: Buffer) => sharp.Sharp,
    operationType: OperationType,
    userParams?: object,
  ): Promise<ProcessingResult> {
    const processingResult = await this.processingService.process(
      inputFiles,
      algorithm,
    );
    await this.storeOperationData(
      operationType,
      userParams,
      processingResult.bucketLocation,
    );
    return processingResult;
  }

  private async storeOperationData(
    type: OperationType,
    userParams = {},
    bucketLocation = '',
  ) {
    return await this.imageProcessingRepository.save(
      type,
      userParams,
      bucketLocation,
    );
  }
}
