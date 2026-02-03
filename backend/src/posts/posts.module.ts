import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { Like } from './entities/like.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [
		TypeOrmModule.forFeature([Post, User, Like]),
		JwtModule,
		UsersModule
	],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
