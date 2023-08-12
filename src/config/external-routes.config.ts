import { IsString, IsNotEmpty } from 'class-validator';
import { registerAs } from '@nestjs/config';

export class ExternalRoutesConfigSchema {
  @IsNotEmpty()
  @IsString()
  bgRemovalUrl: string;

  @IsNotEmpty()
  @IsString()
  makeEmailCheckUrl: string;

  constructor() {
    this.bgRemovalUrl = process.env.BG_REMOVAL_URL as string;
    this.makeEmailCheckUrl = process.env.MAKE_EMAIL_CHECK_URL as string;
  }
}

export const externalRoutesConfig = registerAs(
  'external-routes',
  () => new ExternalRoutesConfigSchema(),
);
