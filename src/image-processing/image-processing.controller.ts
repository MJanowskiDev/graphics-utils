import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ConvertDto, ResizeImageDto } from './dto';
import { BasicTransformationsService } from './basic-transformations/basic-transformations.service';
import { FileValidationPipe } from './validation/file-validation.pipe';
import { BasicTransformationInterceptor } from './interceptor/BasicTransformationInterceptor.interceptor';
import { ProcessingResultDto } from './dto';
import { SwaggerMultiFileBody } from '../core/decorator/swagger-files-upload.decorator';
import { File } from './types';

@Controller('image')
@ApiTags('image')
@ApiBearerAuth()
@UseInterceptors(BasicTransformationInterceptor, FilesInterceptor('files'))
export class ImageProcessingController {
  constructor(
    private basicTransformationsService: BasicTransformationsService,
  ) {}

  @Post('resize')
  @ApiOperation({
    summary: 'Resizes image, when upscaling image quality will be degraded.',
  })
  @SwaggerMultiFileBody
  public resize(
    @Query() { width }: ResizeImageDto,
    @UploadedFiles(new FileValidationPipe()) files: File[],
  ): Promise<ProcessingResultDto> {
    return this.basicTransformationsService.resize(files, width);
  }

  @Post('convert')
  @ApiOperation({
    summary: 'Converts image format, raster graphics accepted only.',
  })
  @SwaggerMultiFileBody
  public convert(
    @Query() { format }: ConvertDto,
    @UploadedFiles(new FileValidationPipe()) files: File[],
  ): Promise<ProcessingResultDto> {
    return this.basicTransformationsService.formatConversion(files, format);
  }

  @Post('grayscale')
  @ApiOperation({
    summary: 'Returns image in 256 shades of gray',
  })
  @SwaggerMultiFileBody
  toGrayscale(
    @UploadedFiles(new FileValidationPipe()) files: File[],
  ): Promise<ProcessingResultDto> {
    return this.basicTransformationsService.toGrayscale(files);
  }
}
