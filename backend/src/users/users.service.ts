import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, Brackets } from 'typeorm';
import { IUser } from 'src/common/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { Like } from 'src/posts/entities/like.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Like) private readonly likesRepository: Repository<Like>,
        @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    ) { }

    async findOneById(id: string, viewerId?: string): Promise<Partial<IUser> | null> {
        const user = await this.userRepository.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                bio: true,
                profileImage: true,
                createdAt: true,
            },
        });

        if (! user) {
            throw new NotFoundException("El usuario no fué encontrado");
        }

        const postsQuery = this.postsRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoin('post.likes', 'postLikes')
            .leftJoin('post.likes', 'viewerLikes', 'viewerLikes.userId = :viewerId', { viewerId: viewerId ?? null })
            .select([
                'post.id',
                'post.title',
                'post.content',
                'post.images',
                'post.createdAt',
                'post.userId',
                'user.id',
                'user.name',
                'user.username',
                'user.email',
                'user.bio',
                'user.profileImage',
                'user.createdAt',
            ])
            .addSelect('COUNT(postLikes.id)', 'likesCount')
            .addSelect('COUNT(viewerLikes.id)', 'likedByMe')
            .where('post.userId = :id', { id })
            .groupBy('post.id')
            .addGroupBy('user.id')
            .orderBy('post.createdAt', 'DESC');

        const postsResult = await postsQuery.getRawAndEntities();
        const posts = postsResult.entities.map((post, index) => ({
            ...post,
            likesCount: Number(postsResult.raw[index]?.likesCount ?? 0),
            likedByMe: Number(postsResult.raw[index]?.likedByMe ?? 0) > 0,
        }));

        const likedPostsQuery = this.likesRepository
            .createQueryBuilder('like')
            .leftJoinAndSelect('like.post', 'post')
            .leftJoinAndSelect('post.user', 'postUser')
            .leftJoin('post.likes', 'postLikes')
            .leftJoin('post.likes', 'viewerLikes', 'viewerLikes.userId = :viewerId', { viewerId: viewerId ?? null })
            .select([
                'like.id',
                'like.createdAt',
                'post.id',
                'post.title',
                'post.content',
                'post.images',
                'post.createdAt',
                'post.userId',
                'postUser.id',
                'postUser.name',
                'postUser.username',
                'postUser.email',
                'postUser.bio',
                'postUser.profileImage',
                'postUser.createdAt',
            ])
            .addSelect('COUNT(postLikes.id)', 'likesCount')
            .addSelect('COUNT(viewerLikes.id)', 'likedByMe')
            .where('like.userId = :id', { id })
            .groupBy('like.id')
            .addGroupBy('post.id')
            .addGroupBy('postUser.id')
            .orderBy('like.createdAt', 'DESC');

        const likedResult = await likedPostsQuery.getRawAndEntities();
        const likedPosts = likedResult.entities.map((like, index) => ({
            ...like.post,
            user: like.post.user,
            likesCount: Number(likedResult.raw[index]?.likesCount ?? 0),
            likedByMe: Number(likedResult.raw[index]?.likedByMe ?? 0) > 0,
        }));

        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            posts,
            likedPosts,
        };
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<{ message: string; user: Partial<IUser> }> {
        let reLogin: boolean = false;

        const user = await this.userRepository.findOneBy({ id });

        if (! user) {
            throw new NotFoundException("El usuario no fué encontrado");
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.userRepository.findOneBy({ email: updateUserDto.email });

            if (existingUser) {
                throw new ConflictException('El email ya está registrado');
            }

            reLogin = true;
        }

        if (updateUserDto.name) {
            user.name = updateUserDto.name;
        }

        if (updateUserDto.username) {
            user.username = updateUserDto.username;
        }

        if (updateUserDto.email) {
            user.email = updateUserDto.email;
        }

        if (typeof updateUserDto.bio !== 'undefined') {
            user.bio = updateUserDto.bio;
        }

        const updatedUser = await this.userRepository.save(user);

        return {
            message: reLogin
                ? 'Usuario actualizado. Por favor, vuelve a iniciar sesión.'
                : 'Usuario actualizado correctamente.',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profileImage: updatedUser.profileImage,
                createdAt: updatedUser.createdAt,
            }
        };
    }

    async updateProfileImage(id: string, profileImage?: Express.Multer.File): Promise<{ message: string; user: Partial<IUser> }> {
        const user = await this.userRepository.findOneBy({ id });

        if (! user) {
            throw new NotFoundException("El usuario no fué encontrado");
        }

        if (! profileImage) {
            return {
                message: 'No se envió imagen de perfil',
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    bio: user.bio,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt,
                }
            };
        }

        const previousProfileImage = user.profileImage;

        user.profileImage = `/uploads/users/${profileImage.filename}`;

        const updatedUser = await this.userRepository.save(user);

        if (previousProfileImage && previousProfileImage.startsWith('/uploads/users/')) {

            // raiz del proyecto y nombre del archivo a eliminar
            const previousFilePath = resolve(process.cwd(), previousProfileImage.replace(/^\//, ''));

            fs.unlink(previousFilePath).catch(() => undefined);
        }

        return {
            message: 'Imagen de perfil actualizada correctamente.',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profileImage: updatedUser.profileImage,
                createdAt: updatedUser.createdAt,
            }
        };
    }

    async searchUsers(query?: string): Promise<Partial<IUser>[]> {
        if (!query?.trim()) {
            return [];
        }

        const term = `%${query.trim()}%`;

        const users = await this.userRepository
            .createQueryBuilder('user')
            .select([
                'user.id',
                'user.name',
                'user.username',
                'user.email',
                'user.bio',
                'user.profileImage',
                'user.createdAt',
            ])
            .where(
                new Brackets((qb) => {
                    qb.where('user.name ILIKE :term', { term })
                        .orWhere('user.username ILIKE :term', { term });
                })
            )
            .orderBy('user.createdAt', 'DESC')
            .limit(20)
            .getMany();

        return users.map((user) => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
        }));
    }
}
