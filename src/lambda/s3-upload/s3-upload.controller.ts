import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '../../core/decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';

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
