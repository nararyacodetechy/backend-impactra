import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entity/post.entity';
import { User } from 'src/user/entity/user.entity';
import { CloudModule } from 'src/cloud/cloud.module';
import { PostCategory } from './entity/post-category.entity';
import { PostPrivateDetails } from './entity/post_private_details.entity';
import { Support } from './entity/support.entity';
import { Comment } from './entity/comment.entity';
import { PostCategoryController } from './post-category.controller';
import { ListPostCategory } from 'src/admin/post-category/entity/type-post-categories.entity';
import { ListPostCategoryController } from 'src/admin/post-category/post-category.controller';

@Module({
    imports: [TypeOrmModule.forFeature([
      Post,
      Comment,
      Support,
      User,
      PostCategory,
      PostPrivateDetails,
      ListPostCategory,
    ]), CloudModule],
    controllers: [PostController, PostCategoryController, ListPostCategoryController],
    providers: [PostService],
    exports: [PostService],
  })
export class PostModule {}
  
