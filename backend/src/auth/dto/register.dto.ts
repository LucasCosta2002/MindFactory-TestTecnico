import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: 'Juan Pérez' })
    @IsString({ message: 'Nombre no valido' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string

    @ApiProperty({ example: 'juanp' })
    @IsString({ message: 'Nombre de usuario no valido' })
    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    username: string

    @ApiProperty({ example: 'juan@email.com' })
    @IsEmail({}, { message: 'El email no es valido' })
    @IsNotEmpty({ message: 'El email es requerido' })
    email: string

    @ApiProperty({ example: 'MiPassword123' })
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password: string;
}
