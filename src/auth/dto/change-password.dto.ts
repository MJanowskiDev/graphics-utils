import { IsNotEmpty, IsString } from 'class-validator';

import { IsValidPassword } from '../decorators';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsValidPassword()
  newPassword: string;

  @IsValidPassword()
  confirmNewPassword: string;
}
