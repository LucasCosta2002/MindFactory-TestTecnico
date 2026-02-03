import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto {
    @ApiProperty({ example: 'Mi primer post' })
    @IsString()
    @IsNotEmpty({ message: 'El título es requerido' })
    @MaxLength(120, { message: 'El título no puede exceder 120 caracteres' })
    title: string;

    @ApiPropertyOptional({ example: 'Contenido del post' })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiPropertyOptional({ type: [String] })
    @IsArray()
    @IsOptional()
    images?: string[];
}
