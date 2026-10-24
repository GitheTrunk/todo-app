import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './jwt.strategy.js';
import {
  AuthGuard,
  GlobalAuthGuard,
  JwtAuthGuard,
  OptionalAuthGuard,
  OptionalJwtAuthGuard,
} from './auth.guard.js';
import { getAuthSecrets } from './auth.config.js';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({ secret: getAuthSecrets().accessTokenSecret, signOptions: { expiresIn: '15m' } }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: GlobalAuthGuard },
    AuthGuard,
    JwtAuthGuard,
    OptionalAuthGuard,
    OptionalJwtAuthGuard,
  ],
  exports: [
    AuthService,
    JwtModule,
    PassportModule,
    AuthGuard,
    JwtAuthGuard,
    OptionalAuthGuard,
    OptionalJwtAuthGuard,
  ],
})
export class AuthModule {}
