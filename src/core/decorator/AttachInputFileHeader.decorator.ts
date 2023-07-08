import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const AttachInputFileHeader = createParamDecorator(
  (_data: never, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    const request = ctx.switchToHttp().getRequest();

    if (!request?.file) {
      throw new HttpException('No input file passed', HttpStatus.BAD_REQUEST);
    }

    const { mimetype, originalname } = request.file;

    response.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${originalname}"`,
    });

    return response;
  },
);
