import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

import { ProcessingResultDto } from '../dto';

@Injectable()
export class AdvancedTransformationsService {
  async removeBackground(
    files: Express.Multer.File[],
  ): Promise<ProcessingResultDto> {
    const url = 'http://127.0.0.1:4100/removebg';
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
