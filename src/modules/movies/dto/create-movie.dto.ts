import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Title of the movie',
    example: 'The Shawshank Redemption',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Year the movie was published',
    example: 1994,
    minimum: 1888,
    maximum: new Date().getFullYear() + 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1888) // First movie ever made
  @Max(new Date().getFullYear() + 10) // Allow upcoming releases
  publishYear: number;

  @ApiProperty({
    description: 'Movie poster/image file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: any; // This will be handled by multer
}
