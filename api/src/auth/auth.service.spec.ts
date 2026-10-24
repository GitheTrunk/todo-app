import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { Role } from '../users/entities/user.entity.js';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { hashPassword } from './auth.utils.js';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'test-access-secret-that-is-long-enough');
    vi.stubEnv('JWT_REFRESH_SECRET', 'test-refresh-secret-that-is-different');
    usersService = {
      findByEmail: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      setRefreshToken: vi.fn(),
    };
    jwtService = {
      signAsync: vi.fn().mockResolvedValue('test-token'),
    };
    authService = new AuthService(usersService as UsersService, jwtService as JwtService);
  });

  it('should register a new user and return a token', async () => {
    (usersService.findByEmail as any).mockResolvedValue(null);
    (usersService.create as any).mockResolvedValue({
      id: 'uuid-123',
      email: 'test@example.com',
      name: 'Test User',
      role: Role.USER,
    });

    const result = await authService.register({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });

    expect(result.accessToken).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });

  it('should reject registration if email is taken', async () => {
    (usersService.findByEmail as any).mockResolvedValue({ id: 'existing' });

    await expect(
      authService.register({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should login valid user and return token', async () => {
    const hashedPassword = await hashPassword('correctPassword');
    (usersService.findByEmail as any).mockResolvedValue({
      id: 'uuid-123',
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: Role.USER,
    });

    const result = await authService.login({
      email: 'test@example.com',
      password: 'correctPassword',
    });

    expect(result.accessToken).toBeDefined();
    expect(result.user.id).toBe('uuid-123');
  });

  it('should reject invalid password on login', async () => {
    const hashedPassword = await hashPassword('correctPassword');
    (usersService.findByEmail as any).mockResolvedValue({
      id: 'uuid-123',
      email: 'test@example.com',
      password: hashedPassword,
    });

    await expect(
      authService.login({
        email: 'test@example.com',
        password: 'wrongPassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
