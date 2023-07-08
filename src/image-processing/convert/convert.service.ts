import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ProcessingService } from '../processing/processing.service';
import { ProcessingResult, File } from '../types';

@Injectable()
export class ConvertService {
  constructor(private processingService: ProcessingService) {}

  async convert(
    inputFiles: File[],
    format: keyof sharp.FormatEnum,
  ): Promise<ProcessingResult> {
    const algorithm = (buffer: Buffer) => sharp(buffer).toFormat(format);
    return await this.processingService.process(inputFiles, algorithm);
  }
}
