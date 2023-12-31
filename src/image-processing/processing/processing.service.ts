import { Injectable, Logger } from '@nestjs/common';
import archiver from 'archiver';
import { Sharp } from 'sharp';
import moment from 'moment';
import streamToPromise from 'stream-to-promise';

import { SharpWithOptions, Algorithm } from '../types';
import { ImagesBucketService } from '../images-bucket/images-bucket.service';
import { ProcessingResultDto } from '../dto';
import { File } from '../types';
import { EventsService } from '../events/events.service';

const ZIP_MIME = 'application/zip';
const ARCHIVE_FORMAT = 'zip';

@Injectable()
export class ProcessingService {
  private readonly logger = new Logger(ProcessingService.name);
  private operationId: string;

  constructor(private imagesBucketService: ImagesBucketService, private eventsService: EventsService) {}

  async process(inputFiles: File[], algorithm: Algorithm, operationId: string): Promise<ProcessingResultDto> {
    this.operationId = operationId;
    this.logger.verbose(`Starting processing - amount to be processed: ${inputFiles.length}`);
    if (!Array.isArray(inputFiles)) {
      this.eventsService.emitEvent(this.operationId, {
        data: `ERROR: inputFiles should be an array`,
      });

      throw new Error('inputFiles should be an array');
    }

    if (inputFiles.length === 0) {
      this.eventsService.emitEvent(this.operationId, {
        data: `ERROR: inputFiles array should not be empty`,
      });
      throw new Error('inputFiles array should not be empty');
    }

    if (!algorithm) {
      this.eventsService.emitEvent(this.operationId, {
        data: `ERROR: algorithm is required`,
      });
      throw new Error('algorithm is required');
    }

    const result =
      inputFiles.length === 1 ? await this.processOne(inputFiles[0], algorithm) : await this.processMany(inputFiles, algorithm);
    this.eventsService.emitEvent(this.operationId, {
      data: `Sending result to S3 bucket`,
    });
    const storeResult = await this.imagesBucketService.storePublic(result.output, result.fileName);
    this.eventsService.emitEvent(this.operationId, {
      data: `Image uploaded to s3 bucket, location: ${storeResult.Location}`,
    });
    return { ...result, bucketLocation: storeResult.Location };
  }

  private async processOne(inputFile: File, algorithm: Algorithm): Promise<ProcessingResultDto> {
    this.logger.verbose(`Processing single file: ${inputFile.originalname}`);
    this.eventsService.emitEvent(this.operationId, {
      data: `Processing file ${inputFile.originalname}`,
    });
    const algorithmInstance = await algorithm(inputFile.buffer);
    const format = await this.extractFormat(algorithmInstance);
    const output = await algorithmInstance.toBuffer();
    const fileName = this.createFileName(inputFile, format);
    return {
      output,
      fileName,
      mime: `image/${format}`,
    };
  }

  private async processMany(inputFiles: File[], operation: (buffer: Buffer) => Sharp): Promise<ProcessingResultDto> {
    this.logger.verbose(`Processing multiple files: ${inputFiles.length}`);
    this.eventsService.emitEvent(this.operationId, {
      data: `Processing multiple files: ${inputFiles.length}`,
    });
    const archive = archiver(ARCHIVE_FORMAT, { zlib: { level: 9 } });

    const processingPromises = inputFiles.map(async (file) => {
      this.eventsService.emitEvent(this.operationId, {
        data: `Processing file ${file.originalname}`,
      });
      const algorithmInstance = operation(file.buffer);
      const buffer = await algorithmInstance.toBuffer();
      const format = await this.extractFormat(algorithmInstance);
      archive.append(buffer, { name: this.createFileName(file, format) });
    });

    await Promise.all(processingPromises);
    this.eventsService.emitEvent(this.operationId, {
      data: `Compressing to archive...`,
    });
    archive.finalize();

    const output = await streamToPromise(archive);
    return {
      output,
      fileName: this.createArchiveName(),
      mime: ZIP_MIME,
    };
  }

  private async extractFormat(instance: Sharp): Promise<string> {
    const instanceWithOptions = instance as SharpWithOptions;
    return instanceWithOptions.options.formatOut === 'input'
      ? ((await instanceWithOptions.metadata()).format as string)
      : instanceWithOptions.options.formatOut;
  }

  private createFileName(inputFile: File, format: string): string {
    return `processed__${inputFile.originalname.split('.')[0]}__${moment().format('YYYY-MM-DD_HH-mm-ss')}.${format}`;
  }

  private createArchiveName(format = ARCHIVE_FORMAT): string {
    return `processed__${moment().format('YYYY-MM-DD_HH-mm-ss')}.${format}`;
  }
}
