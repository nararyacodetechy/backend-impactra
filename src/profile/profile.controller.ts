// src/profile/profile.controller.ts
import { Controller, Get, Param, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity/user.entity';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    // this.logger.log(`Received request for profile: ${username}`);

    // Jika ada @ di depan, hilangkan agar cocok dengan database
    const sanitizedUsername = username.startsWith('@') ? username.slice(1) : username;
    // this.logger.debug(`Sanitized username: ${sanitizedUsername}`);

    const user = await this.userRepo.findOne({
      where: { username: sanitizedUsername },
      select: ['id', 'uuid', 'email', 'full_name', 'username', 'avatar_url', 'bio', 'role'], // pilih field penting
    });

    if (!user) {
      this.logger.warn(`User not found: ${sanitizedUsername}`);
      throw new NotFoundException({
        status: 'error',
        message: 'User not found',
      });
    }

    this.logger.log(`Returning profile for: ${user.username}`);

    return {
      status: 'success',
      data: user,
    };
  }
}
