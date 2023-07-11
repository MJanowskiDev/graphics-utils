import { ApiProperty } from '@nestjs/swagger';

export class ActivateDto {
  @ApiProperty({
    example: 'sucess',
  })
  result: string;
  @ApiProperty({
    example: 'User activated successfully',
  })
  message: string;
}
