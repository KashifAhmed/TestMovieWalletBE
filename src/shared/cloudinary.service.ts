import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { UploadedFileResponse, FileUploadOptions, IUploadService } from './interfaces/upload.interface';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService implements IUploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File, options: FileUploadOptions): Promise<UploadedFileResponse> {
    // Validate file first
    this.validateFile(file, options);

    // Check if buffer exists and has content
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File buffer is empty');
    }

    try {
      const uploadOptions: any = {
        resource_type: 'auto',
        folder: options?.folder || 'movies',
      };

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as any);
            }
          }
        );

        // Create a readable stream from buffer
        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(uploadStream);
      });

      return {
        url: result.secure_url,
        filename: result.original_filename,
        publicId: result.public_id,
        mimetype: result.resource_type,
        size: result.bytes,
        format: result.format,
      };
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new BadRequestException(`File deletion failed: ${error.message}`);
    }
  }

  validateFile(file: Express.Multer.File, options: FileUploadOptions): void {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Check file size
    if (file.size > options.maxSize) {
      throw new BadRequestException(`File size exceeds the limit of ${options.maxSize / 1024 / 1024}MB`);
    }

    // Check file type
    if (!options.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`);
    }
  }
}