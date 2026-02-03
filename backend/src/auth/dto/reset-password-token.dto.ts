import { IsString, MinLength } from 'class-validator';

export class ResetPasswordTokenDto  {
    @IsString({ message: 'Token no válido' })
    token: string;

    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password: string;
}
