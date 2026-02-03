import { Controller, Get, Post,	Body, Param, Delete, UseGuards, Query, ParseUUIDPipe, Patch, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InfinitePaginationDto } from './dto/infinite-pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IPostsService } from './IPostsService';
import { multerConfig } from '../common/multer/multer.config';

@Controller('posts')
export class PostsController implements IPostsService {
	constructor(
		private readonly postsService: PostsService
	) { }

	@Post("/create")
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FilesInterceptor('images', 5, multerConfig))
	create(
		@Body() createPostDto: CreatePostDto,
		@CurrentUser('id') userId: string,
		@UploadedFiles() images?: Express.Multer.File[],
	) {
		return this.postsService.create(createPostDto, userId, images);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll(
		@Query() paginationDto: InfinitePaginationDto,
		@CurrentUser('id') userId: string,
	) {
		const { limit = 10, cursor, search } = paginationDto;

		return this.postsService.findAll(limit, cursor, search, userId);
	}

	@Get('/:id')
	@UseGuards(JwtAuthGuard)
	findOne(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') userId: string,
	) {
		return this.postsService.findOne(id, userId);
	}

	@Post('/:id/like')
	@UseGuards(JwtAuthGuard)
	like(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') userId: string,
	) {
		return this.postsService.like(id, userId);
	}

	@Delete('/:id/like')
	@UseGuards(JwtAuthGuard)
	unlike(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') userId: string,
	) {
		return this.postsService.unlike(id, userId);
	}

	@Patch('/:id')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FilesInterceptor('images', 5, multerConfig))
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updatePostDto: UpdatePostDto,
		@CurrentUser('id') userId: string,
		@UploadedFiles() images?: Express.Multer.File[],
	) {
		return this.postsService.update(id, updatePostDto, userId, images);
	}

	@Delete('/:id')
	@UseGuards(JwtAuthGuard)
	remove(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') userId: string,
	) {
		return this.postsService.remove(id, userId);
	}
}
