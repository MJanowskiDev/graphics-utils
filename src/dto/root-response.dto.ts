import { ApiProperty } from '@nestjs/swagger';

export class RootResponseDto {
  @ApiProperty({
    description: 'Welcome message',
    example: 'Welcome to GraphicsUtils API!',
  })
  message: string;

  @ApiProperty({ description: 'Author of the API', example: 'MJanowskiDev' })
  author: string;

  @ApiProperty({
    description: 'Current server time',
    example: '2022-06-29T09:20:56.577Z',
  })
  serverTime: string;
}
