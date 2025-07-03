import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PrivateProfileService } from './private.service';

@Controller('profile/private')
export class PrivateProfileController {
  constructor(private readonly privateService: PrivateProfileService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req: any) {
    return this.privateService.getMyProfile(req.user.id);
  }
}
