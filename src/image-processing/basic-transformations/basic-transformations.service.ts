import { Injectable } from '@nestjs/common';
import { ProcessingResult, File } from '../types';
import { ProcessingService } from '../processing/processing.service';
import sharp, { FormatEnum } from 'sharp';

@Injectable()
export class BasicTransformationsService {
  constructor(private processingService: ProcessingService) {}

  async formatConversion(
    inputFiles: File[],
    format: keyof FormatEnum,
  ): Promise<ProcessingResult> {
    return await this.processFiles(inputFiles, (b: Buffer) =>
      sharp(b).toFormat(format),
    );
  }

  async resize(inputFiles: File[], width: number): Promise<ProcessingResult> {
    return await this.processFiles(inputFiles, (b: Buffer) =>
      sharp(b).resize({ width }),
    );
  }

  async toGrayscale(inputFiles: File[]): Promise<ProcessingResult> {
    return await this.processFiles(inputFiles, (b: Buffer) =>
      sharp(b).grayscale(true),
    );
  }

  private async processFiles(
    inputFiles: File[],
    algorithm: (buffer: Buffer) => sharp.Sharp,
  ): Promise<ProcessingResult> {
    return await this.processingService.process(inputFiles, algorithm);
  }
}
