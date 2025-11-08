import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadedFileResponse, FileUploadOptions, IUploadService } from './interfaces/upload.interface';
import {Multer} from 'multer';

@Injectable()
export class UploadService implements IUploadService {
  private ensureDirectoryExists(directory: string): void {
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
  }

  getStorageConfig(destination: string) {
    return {
      storage: diskStorage({
        destination: (req, file, callback) => {
          this.ensureDirectoryExists(destination);
          callback(null, destination);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    };
  }

  async uploadFile(file: Express.Multer.File, options: FileUploadOptions): Promise<UploadedFileResponse> {
    this.validateFile(file, options);

    // For local storage, we need to save the file first
    // This is typically handled by Multer interceptor, so we just return the file info
    return {
      url: this.getFileUrl(file.filename),
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      format: extname(file.originalname).replace('.', ''),
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch (error) {
      throw new BadRequestException(`File deletion failed: ${error.message}`);
    }
  }

  validateFile(file: Express.Multer.File, options: FileUploadOptions): void {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (file.size > options.maxSize) {
      throw new BadRequestException(`File size exceeds the limit of ${options.maxSize / 1024 / 1024}MB`);
    }

    if (!options.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`);
    }
  }

  getFileUrl(filename: string, baseUrl: string = ''): string {
    if (baseUrl) {
      return `${baseUrl}/${filename}`;
    }
    return `/uploads/movies/${filename}`; // Adjust path as needed
  }
}