import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '../../core/decorator/public.decorator';

@Public()
@Controller('lambda')
export class S3UploadController {
  @Post()
  onPrivateBucketUpload(@Body() body: any) {
    console.log(body);
  }
}
