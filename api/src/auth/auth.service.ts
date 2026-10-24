import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { verifyPassword } from './auth.utils.js';
import { getAuthSecrets } from './auth.config.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.usersService.create(registerDto);
    return this.createSession(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email, true);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await verifyPassword(loginDto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createSession(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ id: string; type: string }>(refreshToken, {
        secret: getAuthSecrets().refreshTokenSecret,
      });
      if (payload.type !== 'refresh') throw new Error('Wrong token type');

      const user = await this.usersService.findByIdWithRefreshToken(payload.id);
      if (!user?.refreshTokenHash) throw new Error('Refresh token revoked');

      const nextRefreshToken = await this.jwtService.signAsync(
        { id: user.id, type: 'refresh' },
        { secret: getAuthSecrets().refreshTokenSecret, expiresIn: '7d' },
      );
      const rotated = await this.usersService.rotateRefreshToken(
        user.id,
        refreshToken,
        nextRefreshToken,
      );
      if (!rotated) throw new Error('Refresh token already used');

      const accessToken = await this.jwtService.signAsync(
        { id: user.id, email: user.email, name: user.name, role: user.role, type: 'access' },
        { expiresIn: '15m' },
      );
      return { accessToken, refreshToken: nextRefreshToken, user: this.toPublicUser(user) };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) return;
    try {
      const payload = await this.jwtService.verifyAsync<{ id: string; type: string }>(refreshToken, {
        secret: getAuthSecrets().refreshTokenSecret,
      });
      if (payload.type === 'refresh') {
        await this.usersService.revokeRefreshToken(payload.id, refreshToken);
      }
    } catch {
      // Logout remains successful when the refresh token is expired or invalid.
    }
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    return this.toPublicUser(user);
  }

  private toPublicUser(user: { id: string; email: string; name: string; role: string }) {
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  private async createSession(user: { id: string; email: string; name: string; role: string }) {
    const refreshToken = await this.jwtService.signAsync(
      { id: user.id, type: 'refresh' },
      { secret: getAuthSecrets().refreshTokenSecret, expiresIn: '7d' },
    );
    await this.usersService.setRefreshToken(user.id, refreshToken);
    const accessToken = await this.jwtService.signAsync(
      { id: user.id, email: user.email, name: user.name, role: user.role, type: 'access' },
      { expiresIn: '15m' },
    );
    return { accessToken, refreshToken, user: this.toPublicUser(user) };
  }
}
