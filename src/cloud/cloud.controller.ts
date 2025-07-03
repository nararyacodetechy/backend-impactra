import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudService } from './cloud.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
  
@Controller('cloud')
export class CloudController {
  constructor(private readonly cloudService: CloudService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: new CloudService().getStorage(), // atau inject via constructor
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      url: file.path, // Cloudinary public URL
      originalName: file.originalname,
    };
  }
}
  