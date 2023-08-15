import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { registerAs } from '@nestjs/config';

class SmtpConfig {
  @IsNotEmpty()
  @IsNumber()
  port: number;

  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  pass: string;

  constructor() {
    this.port = 587;
    this.user = process.env.SMTP_USER as string;
    this.pass = process.env.SMTP_PASS as string;
  }
}

class TemplatePathsConfig {
  @IsNotEmpty()
  @IsString()
  activate: string;

  @IsNotEmpty()
  @IsString()
  welcome: string;

  @IsNotEmpty()
  @IsString()
  initPasswordReset: string;

  @IsNotEmpty()
  @IsString()
  confirmPasswordReset: string;

  constructor() {
    this.activate = './emailTemplates/activationEmail.mjml';
    this.welcome = './emailTemplates/welcomeEmail.mjml';
    this.initPasswordReset = './emailTemplates/initPasswordReset.mjml';
    this.confirmPasswordReset = './emailTemplates/finishPasswordReset.mjml';
  }
}

export class EmailConfigSchema {
  @IsNotEmpty()
  smtp: SmtpConfig;

  @IsNotEmpty()
  @IsString()
  service: string;

  @IsNotEmpty()
  templatePaths: TemplatePathsConfig;

  @IsNotEmpty()
  @IsString()
  activateUrl: string;

  @IsNotEmpty()
  @IsString()
  passwordResetUrl: string;

  constructor() {
    this.smtp = new SmtpConfig();
    this.service = 'gmail';
    this.templatePaths = new TemplatePathsConfig();
    this.activateUrl = `${process.env.FRONTEND_URL}/auth/activate?token=`;
    this.passwordResetUrl = `${process.env.FRONTEND_URL}/password-reset?token=`;
  }
}

export const emailConfig = registerAs('email', () => new EmailConfigSchema());
