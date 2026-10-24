import { Injectable, SetMetadata, ExecutionContext } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class JwtAuthGuard extends PassportAuthGuard('jwt') {}

@Injectable()
export class GlobalAuthGuard extends PassportAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic ? true : super.canActivate(context);
  }
}

@Injectable()
export class AuthGuard extends JwtAuthGuard {}

@Injectable()
export class OptionalJwtAuthGuard extends PassportAuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      return null as any;
    }
    return user;
  }
}

@Injectable()
export class OptionalAuthGuard extends OptionalJwtAuthGuard {}
