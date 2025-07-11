// src/post/post-category.controller.ts
import { Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCategory } from './entity/post-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ListPostCategory } from 'src/admin/post-category/entity/type-post-categories.entity';

@Controller('post-categories')
export class PostCategoryController {
  constructor(
    @InjectRepository(PostCategory)
    private categoryRepo: Repository<PostCategory>,

    @InjectRepository(ListPostCategory)
    private listCategoryRepo: Repository<ListPostCategory>,
  ) {}

  @Get()
  async getAllCategories() {
    const categories = await this.categoryRepo.find({
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
          posts: category.posts,
        },
      })),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: any, @Body() dto: CreateCategoryDto) {
    const user = req.user;

    const newCategory = this.categoryRepo.create({
      name: dto.name,
      description: dto.description,
      image_url: dto.image_url,
      visibility_mode: dto.visibility_mode || 'full_public',
      idea_details: dto.idea_details,
      internal_notes: dto.internal_notes,
      author: user,
    });

    if (dto.template_id) {
      const template = await this.listCategoryRepo.findOne({ where: { id: dto.template_id } });
      if (template) {
        newCategory.template = template;
      } else {
        throw new NotFoundException('Template kategori tidak ditemukan');
      }
    }

    await this.categoryRepo.save(newCategory);
    return {
      status: 'success',
      data: {
        id: newCategory.template?.id || null,
        name: newCategory.template?.name || null,
        description: newCategory.template?.description || null,
        category: {
          uuid: newCategory.uuid,
          name: newCategory.name,
          description: newCategory.description,
          created_at: newCategory.created_at,
          image_url: newCategory.image_url,
          visibility_mode: newCategory.visibility_mode,
          idea_details: newCategory.idea_details,
          internal_notes: newCategory.internal_notes,
          posts: newCategory.posts,
        },
      },
    };
  }

  @Get('uuid/:uuid/posts')
  async getByUUID(@Param('uuid') uuid: string) {
    const category = await this.categoryRepo.findOne({
      where: { uuid },
      relations: ['posts', 'posts.author', 'template'],
    });

    if (!category) throw new NotFoundException('Kategori tidak ditemukan');

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
          posts: category.posts,
        },
      },
    };
  }
}