import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { SupportedImageFormats } from '../../core/enums/supported-image-formats.enum';

export class ConvertDto {
  @ApiProperty({
    name: 'format',
    description: 'The format to convert the image to.',
    enum: SupportedImageFormats,
  })
  @IsNotEmpty()
  @IsEnum(SupportedImageFormats)
  format: SupportedImageFormats;
}
