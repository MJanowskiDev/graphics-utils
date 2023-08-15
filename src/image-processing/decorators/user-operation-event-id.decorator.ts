import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { OperationType } from '../types';

export const UserOperationEventId = createParamDecorator(async (preDefinedOperation = '', ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userId = request.user.id;

  const operationType = preDefinedOperation ? preDefinedOperation : request.params.operationType;

  if (!Object.values(OperationType).includes(operationType)) {
    throw new Error(`Unsupported operation type: ${operationType}`);
  }

  return `${userId}_${operationType}`;
});
