import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordTokenDto } from './dto/reset-password-token.dto';
import { IAuthService } from './IAuthService';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { IUser } from 'src/common/types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController implements IAuthService {
	constructor(
		private readonly authService: AuthService
	) {}

	// Obtener los datos del usuario autenticado para proteger rutas
	@Get("/me")
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Obtener usuario autenticado' })
	@ApiResponse({ status: 200, description: 'Datos del usuario autenticado' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	@UseGuards(JwtAuthGuard)
	me(@CurrentUser() user: IUser) {
		return {
			id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			bio: user.bio ?? null,
			profileImage: user.profileImage ?? null
		};
	}

	@Post("/register")
	@ApiOperation({ summary: 'Registrar usuario' })
	@ApiResponse({ status: 201, description: 'Usuario registrado' })
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post("/confirm-account")
	@ApiOperation({ summary: 'Confirmar cuenta' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				token: { type: 'string' }
			},
			required: ['token']
		}
	})
	@ApiResponse({ status: 200, description: 'Cuenta confirmada' })
	@ApiResponse({ status: 400, description: 'Token inválido o expirado' })
	confirmAccount(@Body('token') token: string) {
		return this.authService.confirmAccount(token);
	}

	@Post("/login")
	@ApiOperation({ summary: 'Iniciar sesión' })
	@ApiResponse({ status: 200, description: 'Login exitoso' })
	@ApiResponse({ status: 401, description: 'Credenciales inválidas' })
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	// Envia el token por correo
	@Post("/forgot-password")
	@ApiOperation({ summary: 'Solicitar restablecimiento de contraseña' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				email: { type: 'string', format: 'email' }
			},
			required: ['email']
		}
	})
	@ApiResponse({ status: 200, description: 'Correo enviado' })
	@ApiResponse({ status: 400, description: 'Email inválido' })
	forgotPassword(@Body('email') email: string) {
		return this.authService.forgotPassword(email);
	}

	// enviamos las nuevas contraseñas junto con el token
	@Post("/reset-password/:token")
	@ApiOperation({ summary: 'Restablecer contraseña con token' })
	@ApiParam({ name: 'token', required: true })
	@ApiResponse({ status: 200, description: 'Contraseña actualizada' })
	@ApiResponse({ status: 400, description: 'Token inválido o contraseña inválida' })
	resetPasswordByToken(@Body() resetPasswordTokenDto: ResetPasswordTokenDto) {
		return this.authService.resetPasswordByToken(resetPasswordTokenDto);
	}
}
