import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordTokenDto } from './dto/reset-password-token.dto';
import { IAuthService } from './IAuthService';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { IUser } from 'src/common/types';

@Controller('auth')
export class AuthController implements IAuthService {
	constructor(
		private readonly authService: AuthService
	) {}

	// Obtener los datos del usuario autenticado para proteger rutas
	@Get("/me")
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
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post("/confirm-account")
	confirmAccount(@Body('token') token: string) {
		return this.authService.confirmAccount(token);
	}

	@Post("/login")
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	// Envia el token por correo
	@Post("/forgot-password")
	forgotPassword(@Body('email') email: string) {
		return this.authService.forgotPassword(email);
	}

	// enviamos las nuevas contraseñas junto con el token
	@Post("/reset-password/:token")
	resetPasswordByToken(@Body() resetPasswordTokenDto: ResetPasswordTokenDto) {
		return this.authService.resetPasswordByToken(resetPasswordTokenDto);
	}
}
