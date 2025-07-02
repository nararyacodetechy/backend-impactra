// src/profile/profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getProfileByUsername(username: string) {
    const formattedUsername = username.startsWith('@') ? username : `@${username}`;

    const user = await this.userRepo.findOne({
      where: { username: formattedUsername },
      select: ['id', 'uuid', 'email', 'full_name', 'username', 'avatar_url', 'bio', 'role'],
    });

    if (!user) {
      throw new NotFoundException({
        status: 'error',
        message: 'Profile not found',
      });
    }

    return user;
  }
}
