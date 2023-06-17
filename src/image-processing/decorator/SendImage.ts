import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SendImage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { mimetype, originalName } = ctx.switchToHttp().getRequest().file;
    const response = ctx.switchToHttp().getResponse();
    response.setHeader('Content-Type', mimetype);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="resized_${originalName}"`,
    );
    return response;
  },
);
