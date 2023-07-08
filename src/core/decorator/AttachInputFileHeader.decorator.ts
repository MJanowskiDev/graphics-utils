import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const AttachInputFileHeader = createParamDecorator(
  (_data: never, ctx: ExecutionContext) => {
    const { response } = ctx.switchToHttp().getResponse();

    if (!response?.file) {
      throw new HttpException('No input file passed', HttpStatus.BAD_REQUEST);
    }
    const { mimetype, originalname } = response;

    response.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${originalname}"`,
    });

    return response;
  },
);
