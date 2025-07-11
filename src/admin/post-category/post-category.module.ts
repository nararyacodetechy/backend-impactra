// src/admin/post-category/post-category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListPostCategory } from './entity/type-post-categories.entity';
import { ListPostCategoryController } from './post-category.controller';
import { PostCategoryService } from './post-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([ListPostCategory])],
  controllers: [ListPostCategoryController],
  providers: [PostCategoryService],
  exports: [PostCategoryService],
})
export class PostCategoryModule {}
