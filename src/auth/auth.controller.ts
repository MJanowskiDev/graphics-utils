import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../core/decorator/public.decorator';
import { SignInDto, SignUpDto } from './dto';
import { Role } from 'src/core/enums/role.enum';
import { Roles } from '../core/decorator/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('sign-up')
  register(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Get('activate')
  activate(@Query('token') token: string) {
    return this.authService.activate(token);
  }

  @Get('test')
  test() {
    return 'OK';
  }

  @Roles(Role.admin)
  @Get('admin-only')
  adminOnly() {
    return 'You are admin OK';
  }
}
