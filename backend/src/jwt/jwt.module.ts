import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './jwt.service';

@Module({
    imports: [ConfigModule],
    providers: [JwtService],
    exports: [JwtService], // exportamos el servicio para usarlo en otros módulos
})
export class JwtModule {}
