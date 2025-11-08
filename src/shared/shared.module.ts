import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CloudinaryService } from './cloudinary.service';
import { FileService } from './file.service';

@Module({
  providers: [
    UploadService,
    CloudinaryService,
    {
      provide: 'IUploadService',
      useClass: process.env.STORAGE_TYPE === 'cloudinary' ? CloudinaryService : UploadService,
    },
    FileService,
  ],
  exports: ['IUploadService', FileService, UploadService, CloudinaryService],
})
export class SharedModule {}