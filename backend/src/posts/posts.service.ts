import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { IPost } from 'src/common/types';
import { Like } from './entities/like.entity';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(Post)
		private readonly postsRepository: Repository<Post>,
		@InjectRepository(Like)
		private readonly likesRepository: Repository<Like>,
	) { }

	async create(createPostDto: CreatePostDto, userId: string, images?: Express.Multer.File[]): Promise<{ message: string; post: IPost }> {
		const imagePaths = images?.map(file => `/uploads/posts/${file.filename}`) || [];

		const post = this.postsRepository.create({
			...createPostDto,
			images: imagePaths.length > 0
				? imagePaths
				: null,
			user: { id: userId }
		});

		const savedPost = await this.postsRepository.save(post);

		return {
			message: 'Publicación creada exitosamente',
			post: {
				id: savedPost.id,
				title: savedPost.title,
				content: savedPost.content,
				images: savedPost.images,
				createdAt: savedPost.createdAt,
				userId: savedPost.userId,
				likesCount: 0,
				likedByMe: false,
			}
		}
	}

	async findAll(limit = 10, cursor?: string, search?: string, userId?: string) {
		const qb = this.postsRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.user', 'user')
			.leftJoin('post.likes', 'likes')
			.leftJoin('post.likes', 'userLikes', 'userLikes.userId = :userId', { userId: userId ?? null })
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
				'user.createdAt'
			])
			.addSelect('COUNT(likes.id)', 'likesCount')
			.addSelect('COUNT(userLikes.id)', 'likedByMe')
			.groupBy('post.id')
			.addGroupBy('user.id')
			.orderBy('post.createdAt', 'DESC')
			.take(limit + 1);

		if (search?.trim()) {
			const term = `%${search.trim()}%`;
			qb.andWhere(
				new Brackets((where) => {
					where
						.where('post.title ILIKE :term', { term })
						.orWhere('post.content ILIKE :term', { term });
				})
			);
		}

		if (cursor) {
			qb.andWhere('post.createdAt < :cursor', {
				cursor: new Date(cursor),
			});
		}

		const { entities, raw } = await qb.getRawAndEntities();
		const posts = entities.map((post, index) => ({
			...post,
			likesCount: Number(raw[index]?.likesCount ?? 0),
			likedByMe: Number(raw[index]?.likedByMe ?? 0) > 0,
		}));

		const hasMore = posts.length > limit;
		const items = hasMore ? posts.slice(0, limit) : posts;

		return {
			posts: items,
			nextCursor: hasMore
				? items[items.length - 1].createdAt
				: null,
		};
	}

	async findOne(id: string, userId?: string): Promise<IPost> {
		const qb = this.postsRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.user', 'user')
			.leftJoin('post.likes', 'likes')
			.leftJoin('post.likes', 'userLikes', 'userLikes.userId = :userId', { userId: userId ?? null })
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
				'user.createdAt'
			])
			.addSelect('COUNT(likes.id)', 'likesCount')
			.addSelect('COUNT(userLikes.id)', 'likedByMe')
			.where('post.id = :id', { id })
			.groupBy('post.id')
			.addGroupBy('user.id');

		const { entities, raw } = await qb.getRawAndEntities();
		const post = entities[0];

		if (! post) {
			throw new NotFoundException(`Publicacion no encontrada`);
		}

		return {
			...post,
			likesCount: Number(raw[0]?.likesCount ?? 0),
			likedByMe: Number(raw[0]?.likedByMe ?? 0) > 0,
		};
	}

	async update(id: string, updatePostDto: UpdatePostDto, userId: string, images?: Express.Multer.File[]): Promise<{ message: string; post: IPost }> {
		const post = await this.postsRepository.findOne({
			where: { id },
		});

		if (! post) {
			throw new NotFoundException(`Publicacion no encontrada`);
		}

		if (post.userId !== userId) {
			throw new ForbiddenException('No tienes permiso para editar esta publicación');
		}

		const existingImages = post.images || [];
		let updatedImages = existingImages;

		if (updatePostDto.removeImages?.length) {
			updatedImages = existingImages.filter(
				(image) => !updatePostDto.removeImages?.includes(image)
			);
		}

		if (images && images.length > 0) {
			const newImagePaths = images.map(file => `/uploads/posts/${file.filename}`);
			updatedImages = [...updatedImages, ...newImagePaths];
		}

		if (updatePostDto.removeImages?.length || (images && images.length > 0)) {
			if (updatedImages.length > 0) {
				updatePostDto.images = updatedImages;
			} else {
				updatePostDto.images = undefined;
				post.images = null;
			}
		}

		const { removeImages, ...rest } = updatePostDto;
		Object.assign(post, rest);

		await this.postsRepository.save(post);

		const likesCount = await this.likesRepository.count({
			where: { post: { id: post.id } },
		});

		return {
			message: 'Publicación actualizada exitosamente',
			post: {
				...post,
				likesCount,
				likedByMe: false,
			},
		}
	}

	async like(postId: string, userId: string): Promise<{ message: string; liked: boolean }> {
		const post = await this.postsRepository.findOne({ where: { id: postId } });
		if (! post) {
			throw new NotFoundException('Publicacion no encontrada');
		}

		const existing = await this.likesRepository.findOne({
			where: { post: { id: postId }, user: { id: userId } },
		});

		if (existing) {
			return { message: 'Ya te gusta esta publicación', liked: true };
		}

		const like = this.likesRepository.create({
			post: { id: postId },
			user: { id: userId },
		});

		await this.likesRepository.save(like);
		return { message: 'Te gusta esta publicación', liked: true };
	}

	async unlike(postId: string, userId: string): Promise<{ message: string; liked: boolean }> {
		const existing = await this.likesRepository.findOne({
			where: { post: { id: postId }, user: { id: userId } },
		});

		if (!existing) {
			return { message: 'Ya no te gusta esta publicación', liked: false };
		}

		await this.likesRepository.remove(existing);
		return { message: 'Ya no te gusta esta publicación', liked: false };
	}

	async remove(id: string, userId: string): Promise<{ message: string }> {
		const post = await this.postsRepository.findOne({
			where: { id },
		});

		if (! post) {
			throw new NotFoundException(`Publicacion no encontrada`);
		}

		if (post.userId !== userId) {
			throw new ForbiddenException('No tienes permiso para eliminar esta publicación');
		}

		const imagesToDelete = post.images ?? [];

		await this.postsRepository.remove(post);

		await Promise.allSettled(
			imagesToDelete.map(async (imagePath) => {
				const filePath = resolve(process.cwd(), imagePath.replace(/^\//, ''));
				await fs.unlink(filePath).catch(() => undefined);
			})
		);

		return {
			message: 'Publicación eliminada exitosamente',
		}
	}
}
