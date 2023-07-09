import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNotEmpty, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class ResizeImageDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Max(5000)
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty()
  width: number;
}
