// src/profile/private.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { PostCategory } from 'src/post/entity/post-category.entity';
import { ListPostCategory } from 'src/admin/post-category/entity/type-post-categories.entity';

@Injectable()
export class PrivateProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(PostCategory) private readonly postCategoryRepo: Repository<PostCategory>,
    @InjectRepository(ListPostCategory) private readonly listCategoryRepo: Repository<ListPostCategory>,
  ) {}

  async getMyProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['posts', 'posts.comments', 'posts.supports'],
    });

    if (!user) throw new NotFoundException('User not found');

    const categories = await this.postCategoryRepo.find({
      where: { author: { id: userId } },
      relations: ['template', 'posts', 'posts.author'],
      order: { created_at: 'DESC' },
    });

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
        post_categories: categories.map((category) => ({
          id: category.template?.id || null,
          name: category.template?.name || null,
          description: category.template?.description || null,
          category: {
            uuid: category.uuid,
            name: category.name,
            description: category.description,
            created_at: category.created_at,
            image_url: category.image_url,
            visibility_mode: category.visibility_mode,
            idea_details: category.idea_details,
            internal_notes: category.internal_notes,
            total_posts: category.posts.length,
            posts: category.posts.map((post) => ({
              id: post.id,
              uuid: post.uuid,
              title: post.title,
              created_at: post.created_at,
              image_url: post.image_url,
            })),
          },
        })),
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

  async getMyPostCategories(userId: number) {
    const categories = await this.postCategoryRepo.find({
      where: { author: { id: userId } },
      relations: ['template', 'posts', 'posts.author'],
      order: { created_at: 'DESC' },
    });

    return {
      status: 'success',
      data: categories.map((category) => ({
        id: category.template?.id || null,
        name: category.template?.name || null,
        description: category.template?.description || null,
        category: {
          uuid: category.uuid,
          name: category.name,
          description: category.description,
          created_at: category.created_at,
          image_url: category.image_url,
          visibility_mode: category.visibility_mode,
          idea_details: category.idea_details,
          internal_notes: category.internal_notes,
          total_posts: category.posts.length,
          posts: category.posts.map((post) => ({
            id: post.id,
            uuid: post.uuid,
            title: post.title,
            created_at: post.created_at,
            image_url: post.image_url,
          })),
        },
      })),
    };
  }

  async getMyCategoryDetail(userId: number, uuid: string) {
    const category = await this.postCategoryRepo.findOne({
      where: { uuid, author: { id: userId } },
      relations: ['template', 'posts', 'posts.author', 'posts.comments', 'posts.supports'],
    });

    if (!category) throw new NotFoundException('Category not found');

    return {
      status: 'success',
      data: {
        id: category.template?.id || null,
        name: category.template?.name || null,
        description: category.template?.description || null,
        category: {
          uuid: category.uuid,
          name: category.name,
          description: category.description,
          created_at: category.created_at,
          image_url: category.image_url,
          visibility_mode: category.visibility_mode,
          idea_details: category.idea_details,
          internal_notes: category.internal_notes,
          total_posts: category.posts.length,
          posts: category.posts
            .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
            .map((post) => ({
              id: post.id,
              uuid: post.uuid,
              title: post.title,
              created_at: post.created_at,
              image_url: post.image_url,
              total_comments: post.comments.length,
              total_supports: post.supports.length,
            })),
        },
      },
    };
  }
}