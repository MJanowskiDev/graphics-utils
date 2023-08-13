import { Controller, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ConvertDto, ResizeImageDto } from './dto';
import { BasicTransformationsService } from './basic-transformations/basic-transformations.service';
import { FileValidationPipe } from './validation/file-validation.pipe';
import { BasicTransformationInterceptor } from './interceptor/BasicTransformationInterceptor.interceptor';
import { ProcessingResultDto } from './dto';
import { SwaggerFileBody } from '../core/decorator/swagger-files-upload.decorator';
import { File, OperationType } from './types';
import { AdvancedTransformationsService } from './advanced-transformations/advanced-transformations.service';
import { UserOperationEventId } from './decorators/user-operation-event-id.decorator';

@Controller('image')
@ApiTags('image')
@ApiBearerAuth()
@UseInterceptors(BasicTransformationInterceptor, FilesInterceptor('files'))
export class ImageProcessingController {
  constructor(
    private basicTransformationsService: BasicTransformationsService,
    private advancedTransformationsService: AdvancedTransformationsService,
  ) {}

  @Post('resize')
  @ApiOperation({
    summary: 'Resizes image, when upscaling image quality will be degraded.',
  })
  @SwaggerFileBody
  public resize(
    @Query() { width }: ResizeImageDto,
    @UploadedFiles(new FileValidationPipe()) files: File[],
    @UserOperationEventId(OperationType.resize) operationId: string,
  ): Promise<ProcessingResultDto> {
    return this.basicTransformationsService.resize(files, width, operationId);
  }

  @Post('convert')
  @ApiOperation({
    summary: 'Converts image format, raster graphics accepted only.',
  })
  @SwaggerFileBody
  public convert(
    @Query() { format }: ConvertDto,
    @UploadedFiles(new FileValidationPipe()) files: File[],
    @UserOperationEventId(OperationType.formatConversion) operationId: string,
  ): Promise<ProcessingResultDto> {
    return this.basicTransformationsService.formatConversion(files, format, operationId);
  }

  @Post('grayscale')
  @ApiOperation({
    summary: 'Returns image in 256 shades of gray',
  })
  @SwaggerFileBody
  toGrayscale(
    @UploadedFiles(new FileValidationPipe()) files: File[],
    @UserOperationEventId(OperationType.toGrayscale) operationId: string,
  ): Promise<ProcessingResultDto> {
    return this.basicTransformationsService.toGrayscale(files, operationId);
  }

  @Post('bgremoval')
  @ApiOperation({
    summary: 'Returns image in png format with transparent background',
  })
  @SwaggerFileBody
  bgRemoval(@UploadedFiles(new FileValidationPipe()) files: File[]): Promise<ProcessingResultDto> {
    return this.advancedTransformationsService.removeBackground(files);
  }
}
