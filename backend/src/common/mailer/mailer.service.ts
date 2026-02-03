import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

type EmailType = {
    name: string
    email: string
    token: string
}

@Injectable()
export class MailerService {
    private transport : nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transport = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS'),
            },
        });
    }

    async sendConfirmationEmail(user: EmailType) {
        await this.transport.sendMail({
            from: `MindFactory <${this.configService.get<string>('EMAIL_USER')}>`,
            to: user.email,
            subject: 'MindFactory - Confirma tu cuenta',
            html: `
                <p>Hola ${user.name}, has creado tu cuenta en MindFactory, ya está casi lista</p>
                <p>Visita el siguiente enlace: </p>
                <a href="${this.configService.get<string>('FRONTEND_URL')}/confirm-account/${user.token}">Confirmar cuenta</a>
                <p>e ingresa el código <b>${user.token}</b></p>
            `,
        });
    }

    async sendForgotPasswordEmail(user: EmailType) {
        await this.transport.sendMail({
            from: `MindFactory <${this.configService.get<string>('EMAIL_USER')}>`,
            to: user.email,
            subject: 'MindFactory - Reestablece tu contraseña',
            html: `
                <p>Hola ${user.name}, has solicitado restablecer tu contraseña en MindFactory</p>
                <p>Visita el siguiente enlace: </p>
                <a href="${this.configService.get<string>('FRONTEND_URL')}/reset-password/${user.token}">Reestablecer contraseña</a>
                <p>e ingresa el código <b>${user.token}</b></p>
            `,
        });
    }
}
