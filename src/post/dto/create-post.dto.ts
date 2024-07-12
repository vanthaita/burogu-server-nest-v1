import { IsNumber, IsString, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  category?: string[];
}
