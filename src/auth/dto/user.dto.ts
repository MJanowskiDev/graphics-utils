import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../../core/enums/role.enum';

export class UserDto {
  @ApiProperty({
    example: '123abc456def',
    description: 'The id of the user',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: Role.admin,
    description: 'The role of the user',
    enum: Role,
  })
  role: Role;

  @ApiProperty({
    example: true,
    description: 'Whether user is activated or not',
  })
  activated: boolean;

  @ApiProperty({
    example: '2022-01-01',
    description: 'The created_at date of the user',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    example: '2022-02-01',
    description: 'The updated_at date of the user',
    type: Date,
  })
  updated_at: Date;
}
