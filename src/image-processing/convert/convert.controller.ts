import {
  Controller,
  Post,
  Query,
  Res,
  UploadedFile,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConvertDto } from './dto/format.dto';
import { Response } from 'express';
import { ConvertService } from './convert.service';
import { UploadedFileValidation } from '../validation/uploaded-file.validation';
import { FileProcessingExceptionFilter } from '../exceptions/file-processing.exception.filter';

@Controller('convert')
@UseFilters(FileProcessingExceptionFilter)
export class ConvertController {
  constructor(private convertService: ConvertService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async convertToFormat(
    @UploadedFile(UploadedFileValidation)
    file: Express.Multer.File,
    @Query(new ValidationPipe({ transform: true }))
    { format }: ConvertDto,
    @Res() res: Response,
  ) {
    const { buffer, fileName, mime } =
      await this.convertService.convertToFormat(
        file.buffer,
        format,
        file.originalname,
      );

    res
      .set({
        'Content-Type': mime,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      })
      .send(buffer);
  }
}
