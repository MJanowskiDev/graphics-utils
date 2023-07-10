import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  files: Express.Multer.File;
}
