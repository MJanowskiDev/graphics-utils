import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File[]) {
    const files: Express.Multer.File[] = value;

    if (!files || !files.length) {
      throw new BadRequestException('File not provided');
    }
    const mimeTypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/webp',
      'image/avif',
      'image/tiff',
    ];
    const unsupportedFiles = files.filter(
      (file) => !mimeTypes.includes(file.mimetype),
    );

    if (unsupportedFiles.length > 0) {
      throw new BadRequestException('Unsupported file type');
    }

    const tooLargeFiles = files.filter((file) => file.size > 1000000);

    if (tooLargeFiles.length > 0) {
      throw new BadRequestException('File is too large. maximum size is 1MB');
    }

    return value;
  }
}
