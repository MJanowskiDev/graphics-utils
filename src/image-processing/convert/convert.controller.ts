import {
  BadRequestException,
  Controller,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ConvertDto } from './dto/format.dto';
import { Response } from 'express';
import { ConvertService } from './convert.service';
import { UploadedFileValidation } from '../validation/uploaded-file.validation';

@Controller('convert')
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

  @Post('array')
  @UseInterceptors(FilesInterceptor('files'))
  async convertArrayToFormat(
    @Query(new ValidationPipe({ transform: true })) { format }: ConvertDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    if (!files.length) {
      throw new BadRequestException('Cannot convert files, empty files array');
    }

    const { archive, fileName } =
      await this.convertService.convertArrayToFormat(files, format);

    res.attachment(fileName);
    archive.pipe(res);
  }
}
