import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CloudService } from './cloud.service';
  
  @Controller('cloud')
  export class CloudController {
    constructor(private readonly cloudService: CloudService) {}
  
    @Post('upload')
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
  