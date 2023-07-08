import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ProcessingService } from '../processing/processing.service';
import { ProcessingResult, File } from '../types';

@Injectable()
export class ResizeService {
  constructor(private processingService: ProcessingService) {}

  async resize(inputFiles: File[], width: number): Promise<ProcessingResult> {
    const algorithm = (buffer: Buffer) => sharp(buffer).resize({ width });
    return await this.processingService.process(inputFiles, algorithm);
  }
}
