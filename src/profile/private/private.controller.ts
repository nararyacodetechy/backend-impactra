import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
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
}
