import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../core/decorator/public.decorator';

@Public()
@ApiTags('lambda')
@Controller('lambda')
export class S3UploadController {
  @Post()
  onPrivateBucketUpload(@Body() body: any) {
    console.log(body);
    return body;
  }
}
