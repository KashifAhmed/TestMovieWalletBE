import {Multer} from 'multer';

export interface UploadedFileResponse {
  url: string;
  filename: string;
  publicId?: string; // For cloud services like Cloudinary
  mimetype: string;
  size: number;
  format: string;
}

export interface FileUploadOptions {
  allowedMimeTypes: string[];
  maxSize: number;
  folder?: string;
}

export interface IUploadService {
  uploadFile(file: Express.Multer.File, options?: FileUploadOptions): Promise<UploadedFileResponse>;
  deleteFile(publicIdOrPath: string): Promise<void>;
  validateFile(file: Express.Multer.File, options: FileUploadOptions): void;
}