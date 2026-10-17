import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { Profile } from './profile.entity.js';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  async get(): Promise<Profile> {
    const [profile] = await this.profilesRepository.find({
      order: { id: 'ASC' },
      take: 1,
    });
    if (profile) return profile;

    return this.profilesRepository.save(
      this.profilesRepository.create({
        username: 'alexmorgan',
        displayName: 'Alex Morgan',
        email: '',
      }),
    );
  }

  async update(updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.get();
    Object.assign(profile, updateProfileDto);
    return this.profilesRepository.save(profile);
  }
}
