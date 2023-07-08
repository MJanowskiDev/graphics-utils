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
import { AttachInputFileHeader } from '../core/decorator/AttachInputFileHeader.decorator';
import { ResizeImageDto } from './resize/dto/resize.dto';
import { UploadedFileValidation } from './validation/uploaded-file.validation';
import { Response } from 'express';
import { ResizeService } from './resize/resize.service';
import { ConvertDto } from './convert/dto/format.dto';
import { ConvertService } from './convert/convert.service';

@Controller('image')
export class ImageProcessingController {
  constructor(
    private resizeService: ResizeService,
    private convertService: ConvertService,
  ) {}

  @Post('resize')
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
