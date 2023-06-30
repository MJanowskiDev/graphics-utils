import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AttachInputFileHeader = createParamDecorator(
  (_data: never, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    const { mimetype, originalname } = ctx.switchToHttp().getRequest().file;

    response.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${originalname}"`,
    });

    return response;
  },
);
