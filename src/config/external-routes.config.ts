import { IsString, IsNotEmpty } from 'class-validator';
import { registerAs } from '@nestjs/config';

export class ExternalRoutesConfigSchema {
  @IsNotEmpty()
  @IsString()
  bgRemovalUrl: string;

  constructor() {
    this.bgRemovalUrl = process.env.BG_REMOVAL_URL as string;
  }
}

export const externalRoutesConfig = registerAs(
  'external-routes',
  () => new ExternalRoutesConfigSchema(),
);
