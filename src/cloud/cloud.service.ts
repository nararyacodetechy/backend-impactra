import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';

@Injectable()
export class CloudService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  getStorage() {
    return new CloudinaryStorage({
      cloudinary,
      params: async () => ({
        folder: 'impactra',
        allowed_formats: ['jpg', 'jpeg', 'png'],
      }),
    });
  }
  

  getUploader() {
    return multer({ storage: this.getStorage() });
  }
}
