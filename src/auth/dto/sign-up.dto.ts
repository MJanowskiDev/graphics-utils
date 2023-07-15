import { MinLength, Matches } from 'class-validator';

import { CredentialsDto } from './';

export class SignUpDto extends CredentialsDto {
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password must contain at least 8 characters, including one letter, one number, and one special character',
  })
  password: string;
}
