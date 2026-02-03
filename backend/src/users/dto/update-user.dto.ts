import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from '../../auth/dto/register.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterDto) {
    @ApiPropertyOptional({ example: 'Juan Pérez' })
    @IsOptional()
    @IsString({ message: 'Nombre no válido' })
    name?: string;

    @ApiPropertyOptional({ example: 'juanp' })
    @IsOptional()
    @IsString({ message: 'Nombre no válido' })
    username?: string;

    @ApiPropertyOptional({ example: 'juan@email.com' })
    @IsOptional()
    @IsEmail({}, { message: 'El email no es válido' })
    email?: string;

    @ApiPropertyOptional({ example: 'Bio corta' })
    @IsOptional()
    @IsString({ message: 'Bio no válida' })
    @MaxLength(200, { message: 'La bio no puede superar los 200 caracteres' })
    bio?: string;
}
