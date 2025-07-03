import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class PublicProfileService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async getPublicProfile(username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['posts', 'posts.comments', 'posts.supports'],
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      status: 'success',
      data: {
        id: user.id,
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
}
