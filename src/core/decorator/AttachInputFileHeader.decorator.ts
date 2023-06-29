import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AttachInputFileHeader = createParamDecorator(
  (ctx: ExecutionContext) => {
    const { mimetype, originalname } = ctx.switchToHttp().getRequest().file;
    const response = ctx.switchToHttp().getResponse();
    response.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${originalname}"`,
    });

    return response;
  },
);
