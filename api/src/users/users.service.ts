import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { hashPassword } from '../auth/auth.utils.js';
import { createHash } from 'node:crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await hashPassword(createUserDto.password);
    const user = this.usersRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      role: Role.USER,
    });
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { email: 'ASC' },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  findByEmail(email: string, withPassword = false): Promise<User | null> {
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email });

    if (withPassword) {
      qb.addSelect('user.password');
    }

    return qb.getOne();
  }

  async findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.refreshTokenHash')
      .where('user.id = :id', { id })
      .getOne();
  }

  async setRefreshToken(id: string, token: string): Promise<void> {
    await this.usersRepository.update(id, { refreshTokenHash: this.hashToken(token) });
  }

  async rotateRefreshToken(id: string, currentToken: string, nextToken: string): Promise<boolean> {
    const result = await this.usersRepository.update(
      { id, refreshTokenHash: this.hashToken(currentToken) },
      { refreshTokenHash: this.hashToken(nextToken) },
    );
    return (result.affected ?? 0) === 1;
  }

  async revokeRefreshToken(id: string, token: string): Promise<void> {
    await this.usersRepository.update(
      { id, refreshTokenHash: this.hashToken(token) },
      { refreshTokenHash: null },
    );
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email.toLowerCase() !== user.email.toLowerCase()) {
      const existing = await this.findByEmail(updateUserDto.email);
      if (existing) {
        throw new ConflictException('Email already in use');
      }
      user.email = updateUserDto.email.toLowerCase();
    }

    if (updateUserDto.password) {
      user.password = await hashPassword(updateUserDto.password);
    }

    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
}
