import { IsEmail, IsNotEmpty } from 'class-validator';

export abstract class CredentialsDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty()
  password: string;
}
