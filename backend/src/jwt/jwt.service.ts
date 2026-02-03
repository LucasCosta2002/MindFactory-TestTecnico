import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { IUser } from 'src/common/types';

@Injectable()
export class JwtService {
    constructor(
        private readonly configService: ConfigService)
    {}

    generateJWT(user: IUser): string {
        const payload: jwt.JwtPayload = {
            name: user.name,
            email: user.email,
            username: user.username
        }

        const token = jwt.sign({payload}, this.configService.get<string>('JWT_SECRET')!, {
            expiresIn: "24h"
        })

        return token;
    }

    verifyJWT(token: string) {
        return jwt.verify(token, this.configService.get<string>('JWT_SECRET')!);
    }
}