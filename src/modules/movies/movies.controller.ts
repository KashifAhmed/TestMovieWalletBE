import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { memoryStorage } from 'multer';
import { UploadService } from 'src/shared/upload.service';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService, private readonly uploadService: UploadService) {}

  @Post()
@ApiOperation({ summary: 'Create a new movie with image upload' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      publishYear: { type: 'number' },
      image: {
        type: 'string',
        format: 'binary',
      },
    },
    required: ['title', 'publishYear'],
  },
})
@UseInterceptors(
  FileInterceptor('image', {
    storage: memoryStorage(), // Changed from diskStorage to memoryStorage
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }),
)
create(
  @Body() createMovieDto: CreateMovieDto,
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        // new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }), TODO: Enable this option later
      ],
      fileIsRequired: false,
    }),
  )
  file?: Express.Multer.File,
) {
  if (file) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    try {
      this.uploadService.validateFile(file, {allowedMimeTypes, maxSize});
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return this.moviesService.create(createMovieDto, file);  
  }
  return this.moviesService.create(createMovieDto);
}

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by id' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie with optional image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        publishYear: { type: 'number' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(), // Changed from diskStorage to memoryStorage
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          // new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      try {
        this.uploadService.validateFile(file, { allowedMimeTypes, maxSize });
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      return this.moviesService.update(id, updateMovieDto, file);
    }
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
