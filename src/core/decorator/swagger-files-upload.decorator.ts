import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from 'src/image-processing/dto';

export const SwaggerMultiFileBody: MethodDecorator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  ApiConsumes('multipart/form-data')(target, propertyKey, descriptor);
  ApiBody({
    description: 'Images to be processed',
    type: FileUploadDto,
  })(target, propertyKey, descriptor);
};
