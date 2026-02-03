import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString({ message: 'Nombre no valido' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string

    @IsString({ message: 'Nombre de usuario no valido' })
    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    username: string

    @IsEmail({}, { message: 'El email no es valido' })
    @IsNotEmpty({ message: 'El email es requerido' })
    email: string

    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password: string;
}
