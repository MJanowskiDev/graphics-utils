import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertDto {
  @IsNotEmpty()
  @Matches(/png|jpeg|gif|webp|avif|tiff/)
  @ApiProperty()
  format: 'png' | 'jpeg' | 'gif' | 'webp' | 'avif' | 'tiff';
}
