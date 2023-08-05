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
    operationId: string,
  ): Promise<ProcessingResultDto> {
    return await this.processFiles(
      inputFiles,
      (b: Buffer) => sharp(b).toFormat(format),
      OperationType.formatConversion,
      operationId,
      { format },
    );
  }

  async resize(
    inputFiles: File[],
    width: number,
    operationId: string,
  ): Promise<ProcessingResultDto> {
    return await this.processFiles(
      inputFiles,
      (b: Buffer) => sharp(b).resize({ width }),
      OperationType.resize,
      operationId,
      { width },
    );
  }

  async toGrayscale(
    inputFiles: File[],
    operationId: string,
  ): Promise<ProcessingResultDto> {
    return await this.processFiles(
      inputFiles,
      (b: Buffer) => sharp(b).grayscale(true),
      OperationType.toGrayscale,
      operationId,
    );
  }

  private async processFiles(
    inputFiles: File[],
    algorithm: (buffer: Buffer) => sharp.Sharp,
    operationType: OperationType,
    operationId: string,
    userParams?: object,
  ): Promise<ProcessingResultDto> {
    const msg = `Starting basic transformation - amount to be processed: ${
      inputFiles.length
    }, operation: ${operationType}, userParams: ${JSON.stringify(userParams)}`;

    this.eventsService.emitEvent(operationId, {
      data: `Starting operation: ${operationType}, images to be processed: ${inputFiles.length}`,
    });

    this.logger.verbose(msg);
    const processingResult = await this.processingService.process(
      inputFiles,
      algorithm,
      operationId,
    );
    await this.imageProcessingRepository.save(
      operationType,
      processingResult.bucketLocation,
      userParams,
    );
    this.eventsService.emitEvent(operationId, {
      data: `Finished - amount processed: ${inputFiles.length}`,
    });
    return processingResult;
  }
}
