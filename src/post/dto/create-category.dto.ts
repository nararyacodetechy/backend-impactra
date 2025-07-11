// src/post/dto/create-category.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsString, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  template_id?: number;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsOptional()
  @IsEnum(['full_public', 'partial_public', 'private'])
  visibility_mode?: 'full_public' | 'partial_public' | 'private';

  @IsOptional()
  @IsString()
  idea_details?: string;

  @IsOptional()
  @IsString()
  internal_notes?: string;
}