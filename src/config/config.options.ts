import { validateSync } from 'class-validator';

import {
  authConfig,
  awsConfig,
  databaseConfig,
  emailConfig,
  s3BucketsConfig,
  AuthConfigSchema,
  AwsConfigSchema,
  DatabaseConfigSchema,
  EmailConfigSchema,
  S3BucketsConfigSchema,
  externalRoutesConfig,
  ExternalRoutesConfigSchema,
} from './';

export const configModuleOptions = {
  load: [
    authConfig,
    awsConfig,
    databaseConfig,
    emailConfig,
    s3BucketsConfig,
    externalRoutesConfig,
  ],
  isGlobal: true,
  _validate: () => {
    const configObjects = [
      new AuthConfigSchema(),
      new AwsConfigSchema(),
      new DatabaseConfigSchema(),
      new EmailConfigSchema(),
      new S3BucketsConfigSchema(),
      new ExternalRoutesConfigSchema(),
    ];

    const allErrors: string[] = configObjects.flatMap(validateAndFormatErrors);

    if (allErrors.length > 0) {
      throw new Error(allErrors.join('\n\n'));
    }

    return configObjects;
  },
  get validate() {
    return this._validate;
  },
  set validate(value) {
    this._validate = value;
  },
};

function validateAndFormatErrors(configObject: object): string[] {
  const errors = validateSync(configObject, { skipMissingProperties: false });

  if (errors.length === 0) {
    return [];
  }

  return errors.map(
    (error) =>
      `CONFIG VALIDATION ERROR: 
        ${configObject.constructor.name}->${error.property},
        ${Object.values(error.constraints || {}).join(', ')}!`,
  );
}
