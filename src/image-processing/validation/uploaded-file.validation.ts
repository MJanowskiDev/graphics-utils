import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const UploadedFileValidation = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /png|jpeg|gif|webp|avif|tiff/,
  })
  .addMaxSizeValidator({
    maxSize: 100000,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
