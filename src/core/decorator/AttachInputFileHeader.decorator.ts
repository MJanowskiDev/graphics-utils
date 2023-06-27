import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AttachInputFileHeader = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { mimetype, originalName } = ctx.switchToHttp().getRequest().file;
    const response = ctx.switchToHttp().getResponse();

    response.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${originalName}"`,
    });

    return response;
  },
);
