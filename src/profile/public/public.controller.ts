import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PublicProfileService } from './public.service';

@Controller('profile/public')
export class PublicProfileController {
  constructor(private readonly publicService: PublicProfileService) {}

  @Get(':username')
  async getPublicProfile(@Param('username') username: string) {
    return this.publicService.getPublicProfile(username);
  }
}
