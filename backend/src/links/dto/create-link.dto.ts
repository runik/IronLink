import { IsUrl, IsString, IsOptional, MinLength, MaxLength, Matches, Validate } from 'class-validator';
import { IsNotReservedSlug } from '../validators/reservedSlugs';

export class CreateLinkDto {
  @IsUrl({}, { message: 'Please provide a valid URL' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Slug must be at least 3 characters long' })
  @MaxLength(50, { message: 'Slug must not exceed 50 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { 
    message: 'Slug can only contain letters, numbers, hyphens, and underscores' 
  })
  @Validate(IsNotReservedSlug)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
} 