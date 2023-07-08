import { Injectable } from '@nestjs/common';
import archiver from 'archiver';
import { Sharp } from 'sharp';
import moment from 'moment';
import { ProcessingResult, SharpWithOptions, File, Algorithm } from '../types';

const ZIP_MIME = 'application/zip';
const ARCHIVE_FORMAT = 'zip';

@Injectable()
export class ProcessingService {
  async process(
    inputFiles: File[],
    algorithm: Algorithm,
  ): Promise<ProcessingResult> {
    if (!Array.isArray(inputFiles)) {
      throw new Error('inputFiles should be an array');
    }

    if (inputFiles.length === 0) {
      throw new Error('inputFiles array should not be empty');
    }

    if (!algorithm) {
      throw new Error('algorithm is required');
    }

    if (inputFiles.length === 1) {
      return this.processOne(inputFiles[0], algorithm);
    }

    return this.processMany(inputFiles, algorithm);
  }

  private async processOne(
    inputFile: File,
    algorithm: Algorithm,
  ): Promise<ProcessingResult> {
    const algorithmInstance = await algorithm(inputFile.buffer);
    const format = this.extractFormat(algorithmInstance);
    const output = await algorithmInstance.toBuffer();
    const fileName = this.createFileName(inputFile, format);
    return {
      output,
      fileName,
      mime: `image/${format}`,
    };
  }

  private async processMany(
    inputFiles: File[],
    operation: (buffer: Buffer) => Sharp,
  ): Promise<ProcessingResult> {
    const archive = archiver(ARCHIVE_FORMAT, { zlib: { level: 9 } });

    const processingPromises = inputFiles.map(async (file) => {
      const algorithmInstance = operation(file.buffer);
      const buffer = await algorithmInstance.toBuffer();
      const format = this.extractFormat(algorithmInstance);
      archive.append(buffer, { name: this.createFileName(file, format) });
    });

    await Promise.all(processingPromises);
    archive.finalize();

    return {
      output: archive,
      fileName: this.createArchiveName(),
      mime: ZIP_MIME,
    };
  }

  private extractFormat(instance: Sharp): string {
    return (instance as SharpWithOptions).options.formatOut;
  }

  private createFileName(inputFile: File, format: string): string {
    return `processed__${
      inputFile.originalname.split('.')[0]
    }__${moment().format('YYYY-MM-DD_HH-mm-ss')}.${format}`;
  }

  private createArchiveName(format = ARCHIVE_FORMAT): string {
    return `processed__${moment().format('YYYY-MM-DD_HH-mm-ss')}.${format}`;
  }
}
