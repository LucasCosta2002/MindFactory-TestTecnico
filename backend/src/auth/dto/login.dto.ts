import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'El email no es valido' })
    @IsNotEmpty({ message: 'El email es requerido' })
    email: string

    @IsNotEmpty({ message: 'La contraseña es requerida' })
    password: string;
}
