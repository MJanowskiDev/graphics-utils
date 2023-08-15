import { IsInt, IsPositive, IsNotEmpty, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResizeImageDto {
  @ApiProperty({
    description: 'Width of the resized image, height will be calculated automatically to preserve aspect ratio.',
    example: '480',
  })
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Max(5000)
  @Transform(({ value }) => parseInt(value, 10))
  width: number;
}
