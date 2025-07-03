import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

import { PublicProfileController } from './public/public.controller';
import { PublicProfileService } from './public/public.service';
import { PrivateProfileController } from './private/private.controller';
import { PrivateProfileService } from './private/private.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [PublicProfileController, PrivateProfileController],
  providers: [PublicProfileService, PrivateProfileService],
})

export class ProfileModule {}
