import { IsEmail } from 'class-validator';

import { PasswordDto } from './password.dto';

export class SignUpDto extends PasswordDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
