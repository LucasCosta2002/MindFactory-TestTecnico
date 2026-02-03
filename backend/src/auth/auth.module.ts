import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { MailerModule } from 'src/common/mailer/mailer.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
    imports: [
        // Habilitamos repositorios
        TypeOrmModule.forFeature([User]),
        //traer todo del mailer
        MailerModule,
        JwtModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard, JwtService],
    exports: [JwtAuthGuard],
})
export class AuthModule {}
