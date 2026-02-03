import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
	@ApiPropertyOptional({ type: [String], description: 'Imágenes a eliminar por URL' })
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	removeImages?: string[];
}
