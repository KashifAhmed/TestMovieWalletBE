import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { FileService } from 'src/shared/file.service';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PaginatedResult, PaginationDto } from './dto/pagination.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

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
  ) { }

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

  async findAll(userId: string, paginationDto?: PaginationDto): Promise<PaginatedResult<Movie>> {
    const { page = 1, limit = 10 } = paginationDto || {};

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count
    const totalItems = await this.movieRepository.count({
      where: { userId },
    });

    // Get paginated data
    const data = await this.movieRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
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