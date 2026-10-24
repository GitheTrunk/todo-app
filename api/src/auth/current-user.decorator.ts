import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserPayload } from './auth.guard.js';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUserPayload | undefined;
    return data && user ? user[data] : user;
  },
);
