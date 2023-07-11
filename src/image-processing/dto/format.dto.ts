import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class ConvertDto {
  @ApiProperty({
    name: 'format',
    description: 'The format to convert the image to.',
    enum: ['png', 'jpeg', 'jpg', 'gif', 'webp', 'avif', 'tiff'],
  })
  @IsNotEmpty()
  @Matches(/png|jpeg|jpg|gif|webp|avif|tiff/)
  format: 'png' | 'jpeg' | 'jpg' | 'gif' | 'webp' | 'avif' | 'tiff';
}
