import { IsEmail } from 'class-validator';

export class InitializePasswordResetDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
