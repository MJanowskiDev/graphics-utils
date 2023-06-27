import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResizeService } from './resize.service';
import { Response } from 'express';
import { ResizeImageDto } from './dto/resize.dto';
import { AttachInputFileHeader } from '../../core/decorator/AttachInputFileHeader.decorator';
import { FileProcessingExceptionFilter } from '../exceptions/file-processing.exception.filter';
import { UploadedFileValidation } from '../validation/uploaded-file.validation';

@Controller('resize')
@UseFilters(FileProcessingExceptionFilter)
export class ResizeController {
  constructor(private resizeService: ResizeService) {}

  @Get('/healthcheck')
  healthcheck() {
    return {
      status: 'ok',
      timestamp: Date.now(),
      message: 'Service is healthy',
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async resizeImage(
    @UploadedFile(UploadedFileValidation)
    file: Express.Multer.File,
    @Query(new ValidationPipe({ transform: true }))
    { width }: ResizeImageDto,
    @AttachInputFileHeader()
    res: Response,
  ) {
    res.send(
      await this.resizeService.resize(file.buffer, width, file.originalname),
    );
  }
}
