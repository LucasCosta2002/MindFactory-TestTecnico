import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from '../../auth/dto/register.dto';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterDto) {
    @IsOptional()
    @IsString({ message: 'Nombre no válido' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Nombre no válido' })
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: 'El email no es válido' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'Bio no válida' })
    @MaxLength(200, { message: 'La bio no puede superar los 200 caracteres' })
    bio?: string;
}
