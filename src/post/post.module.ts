import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Support } from './entity/support.entity';
import { Post } from './entity/post.entity';
import { Comment } from './entity/comment.entity';  
import { User } from 'src/auth/user.entity/user.entity';
import { CloudModule } from 'src/cloud/cloud.module';

@Module({
    imports: [TypeOrmModule.forFeature([Post, Comment, Support, User]), CloudModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
  })
export class PostModule {}
  
