import { Controller, Get, Post,	Body, Param, Delete, UseGuards, Query, ParseUUIDPipe, Patch, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InfinitePaginationDto } from './dto/infinite-pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IPostsService } from './IPostsService';
import { multerConfig } from '../common/multer/multer.config';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController implements IPostsService {
	constructor(
		private readonly postsService: PostsService
	) { }

	@Post("/create")
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FilesInterceptor('images', 5, multerConfig))
	@ApiOperation({ summary: 'Crear post' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				title: { type: 'string' },
				content: { type: 'string' },
				images: {
					type: 'array',
					items: { type: 'string', format: 'binary' }
				}
			},
			required: ['title']
		}
	})
	@ApiResponse({ status: 201, description: 'Post creado' })
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	create(
		@Body() createPostDto: CreatePostDto,
		@CurrentUser('id') userId: string,
		@UploadedFiles() images?: Express.Multer.File[],
	) {
		return this.postsService.create(createPostDto, userId, images);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Listar posts con paginación' })
	@ApiQuery({ name: 'limit', required: false, type: Number })
	@ApiQuery({ name: 'cursor', required: false, type: String })
	@ApiQuery({ name: 'search', required: false, type: String })
	@ApiResponse({ status: 200, description: 'Listado de posts' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	findAll(
		@Query() paginationDto: InfinitePaginationDto,
		@CurrentUser('id') userId: string,
	) {
		const { limit = 10, cursor, search } = paginationDto;

		return this.postsService.findAll(limit, cursor, search, userId);
	}

	@Get('/:id')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Obtener post por id' })
	@ApiParam({ name: 'id', format: 'uuid' })
	@ApiResponse({ status: 200, description: 'Post encontrado' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	@ApiResponse({ status: 404, description: 'Post no encontrado' })
	findOne(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') userId: string,
	) {
		return this.postsService.findOne(id, userId);
	}

	@Post('/:id/like')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Dar like a un post' })
	@ApiParam({ name: 'id', format: 'uuid' })
	@ApiResponse({ status: 200, description: 'Like agregado' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	@ApiResponse({ status: 404, description: 'Post no encontrado' })
	like(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') userId: string,
	) {
		return this.postsService.like(id, userId);
	}

	@Delete('/:id/like')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Quitar like a un post' })
	@ApiParam({ name: 'id', format: 'uuid' })
	@ApiResponse({ status: 200, description: 'Like removido' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	@ApiResponse({ status: 404, description: 'Post no encontrado' })
	unlike(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') userId: string,
	) {
		return this.postsService.unlike(id, userId);
	}

	@Patch('/:id')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FilesInterceptor('images', 5, multerConfig))
	@ApiOperation({ summary: 'Actualizar post' })
	@ApiParam({ name: 'id', format: 'uuid' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				title: { type: 'string' },
				content: { type: 'string' },
				removeImages: {
					type: 'array',
					items: { type: 'string' }
				},
				images: {
					type: 'array',
					items: { type: 'string', format: 'binary' }
				}
			}
		}
	})
	@ApiResponse({ status: 200, description: 'Post actualizado' })
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	@ApiResponse({ status: 404, description: 'Post no encontrado' })
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
	@ApiOperation({ summary: 'Eliminar post' })
	@ApiParam({ name: 'id', format: 'uuid' })
	@ApiResponse({ status: 200, description: 'Post eliminado' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	@ApiResponse({ status: 404, description: 'Post no encontrado' })
	remove(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') userId: string,
	) {
		return this.postsService.remove(id, userId);
	}
}
