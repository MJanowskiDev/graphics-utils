import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

import { ExternalRoutesConfigSchema } from '../../config';
import { ProcessingResultDto } from '../dto';

@Injectable()
export class AdvancedTransformationsService {
  private config;

  constructor(private emailConfigService: ConfigService) {
    this.config = this.emailConfigService.get<ExternalRoutesConfigSchema>('external-routes');
  }

  async removeBackground(files: Express.Multer.File[]): Promise<ProcessingResultDto> {
    const url = this.config?.bgRemovalUrl;
    if (!url) {
      throw new Error('BG_REMOVAL_URL is not defined');
    }
    const file = files[0];
    const formData = new FormData();
    formData.append('image', file.buffer, { filename: file.originalname });

    const response = await axios.post(url, formData, {
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'Content-Length': formData.getLengthSync(),
      },
    });
    const fileName = `${file.originalname.split('.')[0]}_bg_removed.png`;
    return {
      output: Buffer.from(response.data),
      fileName: fileName,
      mime: 'image/png',
      bucketLocation: '',
    };
  }
}
