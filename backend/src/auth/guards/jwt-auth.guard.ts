import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../../jwt/jwt.service';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (! token) {
            throw new UnauthorizedException('Token no proporcionado');
        }

        try {
            const decoded = this.jwtService.verifyJWT(token) as any;

            // Buscar el usuario en la base de datos usando el email del token
            const user = await this.userRepository.findOneBy({
                email: decoded.payload.email
            });

            if (! user) {
                throw new UnauthorizedException('Usuario no encontrado');
            }

            if (! user.confirmed) {
                throw new UnauthorizedException('Usuario no confirmado');
            }

            // Escribir el usuario en la request
            request['user'] = {
                id: user.id,
                name: user.name,
                email: user.email,
            };

            return true;
        } catch (error) {
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;

        if (! authHeader) {
            return undefined;
        }

        const [type, token] = authHeader.split(' ');

        return type === 'Bearer'
            ? token
            : undefined;
    }
}
