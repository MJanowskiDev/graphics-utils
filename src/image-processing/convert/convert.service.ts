import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ImagesBucketService } from '../images-bucket/images-bucket.service';
import { OperationData } from '../entity';
import { OperationType } from '../types';
import { OperationDataRepository } from '../repository';
import { Logger } from '../../core/logger/Logger';
import archiver from 'archiver';

@Injectable()
export class ConvertService {
  constructor(
    private imagesBucketService: ImagesBucketService,
    private operationDataRepository: OperationDataRepository,
  ) {}

  private readonly logger = new Logger(ConvertService.name);

  async convertToFormat(
    inputBuffer: Buffer,
    format: keyof sharp.FormatEnum,
    fileName: string,
  ): Promise<{ buffer: Buffer; fileName: string; mime: string }> {
    const outputFilename = `converted_${fileName.split('.')[0]}.${format}`;
    const mime = `image/${format}`;

    this.logger.verbose(
      `Uploading private image: ${outputFilename}, mime: ${mime}`,
    );

    const { assetId } = await this.imagesBucketService.storePrivate(
      inputBuffer,
      fileName,
    );

    this.logger.verbose(`Converting image: ${fileName}, to format: ${format}`);

    const buffer = await sharp(inputBuffer).toFormat(format).toBuffer();
    await this.imagesBucketService.storePublic(buffer, outputFilename, assetId);

    this.logger.verbose(
      `Uploading converted image: ${outputFilename}, assetId: ${assetId}}`,
    );

    const operationData = new OperationData();
    operationData.type = OperationType.formatConversion;
    operationData.userParams = JSON.stringify({ format, fileName });
    await this.operationDataRepository.create(operationData);

    return { buffer, fileName: outputFilename, mime };
  }

  async convertArrayToFormat(
    inputFiles: Express.Multer.File[],
    format: keyof sharp.FormatEnum,
  ) {
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const convertPromises = inputFiles.map((file) =>
      sharp(file.buffer)
        .toFormat(format)
        .toBuffer()
        .then((buffer) => {
          const fileName = `${file.originalname.split('.')[0]}.${format}`;
          archive.append(buffer, { name: fileName });
        }),
    );

    await Promise.all(convertPromises);
    archive.finalize();

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const fileName = `images_resized_${[dateStr, now.getTime()].join('_')}.zip`;

    return { archive, fileName };
  }
}
