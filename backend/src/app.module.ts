import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { JwtModule } from './jwt/jwt.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
    imports: [
		//acceder a las variables de entorno en cualquier modulo
		ConfigModule.forRoot({isGlobal: true}),

		//acceder a las variables de entorno en cualquier archivo que no sea un modulo
		TypeOrmModule.forRootAsync({
			useFactory: typeOrmConfig,
			//inyectar las variables de entorno al archivo
			inject: [ConfigService]
		}),
		AuthModule,
		JwtModule,
		UsersModule,
		PostsModule,
	],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
