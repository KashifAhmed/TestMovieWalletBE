import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { UploadService } from 'src/shared/upload.service';
import { FileService } from 'src/shared/file.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), SharedModule],
  controllers: [MoviesController],
  providers: [MoviesService, UploadService, FileService,],
})
export class MoviesModule {}
