import { IsString, IsNotEmpty } from 'class-validator';

export class ExecutePasswordResetQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'Token must not be empty' })
  token: string;
}
