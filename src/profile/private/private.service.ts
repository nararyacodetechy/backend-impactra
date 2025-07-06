import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class PrivateProfileService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async getMyProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['posts', 'posts.comments', 'posts.supports'],
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      status: 'success',
      data: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        full_name: user.full_name,
        username: user.username,
        avatar_url: user.avatar_url,
        bio: user.bio,
        role: user.role,
        created_at: user.created_at,
        posts: user.posts.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()),
      },
    };
  }

  async updateMyProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    await this.userRepo.save(user);

    return {
      status: 'success',
      message: 'Profile updated',
      data: {
        id: user.id,
        full_name: user.full_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
      },
    };
  }

}
