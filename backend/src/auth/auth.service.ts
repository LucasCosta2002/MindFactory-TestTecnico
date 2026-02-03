import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { generateToken } from 'src/utils/token';
import { checkPassword, hashPassword } from 'src/utils/auth';
import { MailerService } from 'src/common/mailer/mailer.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { ResetPasswordTokenDto } from './dto/reset-password-token.dto';
import { IUser } from 'src/common/types';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly mailerService: MailerService,
		private readonly jwtService: JwtService,
	) {}

	async register(registerDto: RegisterDto) : Promise<{message: string}> {
		const {email, name, username, password} = registerDto;

		const userExist = await this.userRepository.findOneBy({ email });

		if ( userExist ) {
			throw new BadRequestException("Ese email ya se encuentra registrado");
		}

		const user = new User();

		user.name = name;
		user.email = email;
		user.username = username;
		user.password = await hashPassword(password);
		user.token = generateToken()

		await this.mailerService.sendConfirmationEmail({
			name: user.name,
			email: user.email,
			token: user.token
		})

		await this.userRepository.save(user);

		return {message: "Usuario creado con exito, revisa tu correo y sigue las instrucciones"};
	}

	async confirmAccount(token: string) : Promise<{message: string}> {
		const user = await this.userRepository.findOneBy({token});

		if (! user ) {
			throw new NotFoundException("Token no valido");
		}

		user.confirmed = true;
		user.token = null

		await this.userRepository.save(user);

		return {message: "Usuario confirmado con exito, ya puedes iniciar sesion"};
	}

	async login(loginDto: LoginDto) : Promise<{user: Partial<IUser>, token: string}> {
		const { email, password } = loginDto;

		const user = await this.findByEmail(email);

		if (! user.confirmed) {
			throw new BadRequestException("El usuario no fué confirmado");
		}

		if (! await checkPassword(password, user.password)) {
			throw new BadRequestException("Email o contraseña incorrectos");
		}

		const token = this.jwtService.generateJWT(user);

		return {
			user: {
				id: user.id,
				name: user.name,
				username: user.username,
				email: user.email,
				bio: user.bio,
				profileImage: user.profileImage,
				createdAt: user.createdAt,
			},
			token
		};
	}

	async forgotPassword(email: string) : Promise<{message: string}> {
		const user = await this.findByEmail(email);

		user.token = generateToken()

		await this.mailerService.sendForgotPasswordEmail({
			name: user.name,
			email: user.email,
			token: user.token
		})

		await this.userRepository.save(user);

		return {message: "Revisa tu correo y sigue las instrucciones para restablecer tu contraseña"};
	}

	async resetPasswordByToken(resetPasswordByTokenDto: ResetPasswordTokenDto) : Promise<{message: string}> {
		const {token, password} = resetPasswordByTokenDto;

		const user = await this.userRepository.findOneBy({token});

		if (! user) {
			throw new BadRequestException("El usuario no fué encontrado");
		}

		user.password = await hashPassword(password);
		user.token = null;

		await this.userRepository.save(user);

		return {message: "Contraseña restablecida con exito"};
	};

	async findByEmail(email: string) : Promise<User> {
		if (! email) {
			throw new BadRequestException("El email es requerido");
		}

		const user = await this.userRepository.findOneBy({email});

		if (! user ) {
			throw new NotFoundException("El usuario no fué encontrado");
		}

		return user;
	}
}