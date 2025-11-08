import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UploadedFileResponse, FileUploadOptions } from './interfaces/upload.interface';
import type { IUploadService } from './interfaces/upload.interface';

export enum StorageType {
    LOCAL = 'local',
    CLOUDINARY = 'cloudinary',
    // Add more storage types as needed
}

@Injectable()
export class FileService {
    constructor(
        @Inject('IUploadService') private uploadService: IUploadService,
    ) { }

    async uploadFile(file: Express.Multer.File, options?: FileUploadOptions): Promise<UploadedFileResponse> {
        return this.uploadService.uploadFile(file, options);
    }

    async deleteFile(publicIdOrPath: string): Promise<void> {
        return this.uploadService.deleteFile(publicIdOrPath);
    }

    validateFile(file: Express.Multer.File, options: FileUploadOptions): void {
        return this.uploadService.validateFile(file, options);
    }
}