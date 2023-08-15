import { IsNotEmpty, IsString } from 'class-validator';

import { PasswordDto } from './password.dto';
import { IsValidPassword } from '../decorators';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsValidPassword()
  newPassword: PasswordDto;

  @IsValidPassword()
  confirmNewPassword: string;
}
