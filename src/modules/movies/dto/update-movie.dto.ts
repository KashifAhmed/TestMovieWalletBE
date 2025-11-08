import { PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  // All fields from CreateMovieDto are now optional
  // title?, publishYear?, image?
}
