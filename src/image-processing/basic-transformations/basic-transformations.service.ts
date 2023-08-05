import { Injectable, Logger } from '@nestjs/common';
import sharp, { FormatEnum } from 'sharp';

import { ProcessingService } from '../processing/processing.service';
import { ImageProcessingRepository } from '../repository';
import { File } from '../types';
import { OperationType } from '../types';
import { ProcessingResultDto } from '../dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class BasicTransformationsService {
  private readonly logger = new Logger(BasicTransformationsService.name);

  constructor(
    private processingService: ProcessingService,
    private imageProcessingRepository: ImageProcessingRepository,
    private eventsService: EventsService,
  ) {}

  async formatConversion(
    inputFiles: File[],
    format: keyof FormatEnum,
  ): Promise<ProcessingResultDto> {
    return await this.processFiles(
      inputFiles,
      (b: Buffer) => sharp(b).toFormat(format),
      OperationType.formatConversion,
      { format },
    );
  }

  async resize(
    inputFiles: File[],
    width: number,
  ): Promise<ProcessingResultDto> {
    return await this.processFiles(
      inputFiles,
      (b: Buffer) => sharp(b).resize({ width }),
      OperationType.resize,
      { width },
    );
  }

  async toGrayscale(inputFiles: File[]): Promise<ProcessingResultDto> {
    this.eventsService.emitEvent('hello-world', {
      data: 'Grayscale operation started',
    });

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
  ): Promise<ProcessingResultDto> {
    this.logger.verbose(
      `Starting basic transformation - amount to be processed: ${
        inputFiles.length
      }, operation: ${operationType}, userParams: ${JSON.stringify(
        userParams,
      )}`,
    );
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
