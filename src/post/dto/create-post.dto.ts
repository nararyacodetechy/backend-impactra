// post/dto/create-post.dto.ts
import { IsNotEmpty, IsOptional, IsEnum, IsString, IsBoolean, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @IsOptional()
  @IsEnum(['full_public', 'partial_public', 'private'])
  visibility_mode?: 'full_public' | 'partial_public' | 'private';

  @IsOptional()
  category_id?: number;

  // Optional private details
  @IsOptional()
  idea_details?: string;

  @IsOptional()
  internal_notes?: string;
}
