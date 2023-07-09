import { Injectable, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(BasicTransformationsService.name);

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
    await this.imageProcessingRepository.save(
      operationType,
      processingResult.bucketLocation,
      userParams,
    );
    return processingResult;
  }
}
