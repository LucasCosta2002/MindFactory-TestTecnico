import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty({ message: 'El título es requerido' })
    @MaxLength(120, { message: 'El título no puede exceder 120 caracteres' })
    title: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsArray()
    @IsOptional()
    images?: string[];
}
