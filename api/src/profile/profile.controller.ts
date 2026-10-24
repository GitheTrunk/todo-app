import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ProfileService } from './profile.service.js';
import { Public } from '../auth/auth.guard.js';

@Controller('profile')
@Public()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  get() {
    return this.profileService.get();
  }

  @Patch()
  update(@Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(updateProfileDto);
  }
}
