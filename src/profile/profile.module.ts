import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

import { PublicProfileController } from './public/public.controller';
import { PublicProfileService } from './public/public.service';
import { PrivateProfileController } from './private/private.controller';
import { PrivateProfileService } from './private/private.service';
import { PostCategory } from 'src/post/entity/post-category.entity';
import { ListPostCategory } from 'src/admin/post-category/entity/type-post-categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PostCategory, ListPostCategory])],
  controllers: [PublicProfileController, PrivateProfileController],
  providers: [PublicProfileService, PrivateProfileService],
})

export class ProfileModule {}
