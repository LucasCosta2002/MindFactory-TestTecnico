import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: 'juan@email.com' })
    @IsEmail({}, { message: 'El email no es valido' })
    @IsNotEmpty({ message: 'El email es requerido' })
    email: string

    @ApiProperty({ example: 'MiPassword123' })
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    password: string;
}
