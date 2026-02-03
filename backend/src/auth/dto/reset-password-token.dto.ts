import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordTokenDto  {
    @ApiProperty({ example: 'token-reset' })
    @IsString({ message: 'Token no válido' })
    token: string;

    @ApiProperty({ example: 'MiPassword123' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password: string;
}
