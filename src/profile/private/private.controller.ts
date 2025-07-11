// src/profile/private.controller.ts
import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PrivateProfileService } from './private.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Controller('profile/private')
@UseGuards(JwtAuthGuard)
export class PrivateProfileController {
  constructor(private readonly privateService: PrivateProfileService) {}

  @Get('me')
  async getMyProfile(@Req() req: any) {
    return this.privateService.getMyProfile(req.user.id);
  }

  @Put('me')
  async updateMyProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.privateService.updateMyProfile(req.user.id, dto);
  }

  @Get('me/post-categories')
  async getMyCategories(@Req() req: any) {
    return this.privateService.getMyPostCategories(req.user.id);
  }

  @Get('me/post-categories/:uuid')
  async getMyCategoryDetail(@Req() req: any, @Param('uuid') uuid: string) {
    return this.privateService.getMyCategoryDetail(req.user.id, uuid);
  }
}