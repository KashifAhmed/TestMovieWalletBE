import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Multer } from 'multer';
import { FileService } from 'src/shared/file.service';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@Injectable()
export class MoviesService {

  private readonly fileUploadOptions = {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    folder: 'movies',
  };

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(createMovieDto: CreateMovieDto, userId: string, file?: Express.Multer.File): Promise<Movie> {
    const movieData: Partial<Movie> = {
      title: createMovieDto.title,
      publishYear: createMovieDto.publishYear,
      userId, // Add userId from authenticated user
    };

    // If file is uploaded, store the file path
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file, this.fileUploadOptions);
      movieData.image = uploadResult.url; // Store Cloudinary URL or local path
    }

    const movie = this.movieRepository.create(movieData);
    return await this.movieRepository.save(movie);
  }

  async findAll(userId: string): Promise<Movie[]> {
    return await this.movieRepository.find({
      where: { userId }, // Only return movies for the authenticated user
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string, userId: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id, userId }, // Check both id and userId
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found or you don't have permission to access it`);
    }

    return movie;
  }

  async update(id: string, userId: string, updateMovieDto: UpdateMovieDto, file?: Express.Multer.File): Promise<Movie> {
    const movie = await this.findOne(id, userId); // This will throw NotFoundException if movie doesn't exist or user doesn't own it

    // Update fields if provided
    if (updateMovieDto.title !== undefined) {
      movie.title = updateMovieDto.title;
    }

    if (updateMovieDto.publishYear !== undefined) {
      movie.publishYear = updateMovieDto.publishYear;
    }

    // If new file is uploaded, update the image path
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file, this.fileUploadOptions);
      movie.image = uploadResult.url;
    }

    return await this.movieRepository.save(movie);
  }

  async remove(id: string, userId: string): Promise<void> {
    const movie = await this.findOne(id, userId); // This will throw NotFoundException if movie doesn't exist or user doesn't own it
    await this.movieRepository.remove(movie);
  }

  // Optional: Additional utility methods
  async exists(id: string): Promise<boolean> {
    const count = await this.movieRepository.count({
      where: { id },
    });
    return count > 0;
  }

  async findByTitle(title: string): Promise<Movie[]> {
    return await this.movieRepository.find({
      where: { title },
      order: { createdAt: 'DESC' },
    });
  }
}