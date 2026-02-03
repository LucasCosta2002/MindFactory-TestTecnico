import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Like } from 'src/posts/entities/like.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Post, Like]),
		AuthModule,
		JwtModule
	],
    controllers: [UsersController],
    providers: [UsersService],
})

export class UsersModule {}
