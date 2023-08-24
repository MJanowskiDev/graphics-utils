import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BearerTokenHeader = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const prod = process.env.NODE_ENV === 'production';

  if (prod) {
    const authToken = request.cookies['auth_token'];
    if (authToken) {
      return authToken;
    }
  } else {
    const authHeader = request.headers['authorization'];
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.replace('Bearer ', '');
    }
  }

  throw new BadRequestException(
    prod ? 'Token not found in cookies.' : 'Invalid Authorization header format. Format is Authorization: Bearer [token]',
  );
});
