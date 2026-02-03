import { Controller, Get, Body, Patch, Param, ParseUUIDPipe, UseGuards, ForbiddenException, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { IUsersService } from './IUsersService';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUser } from '../common/types';
import { profileImageMulterConfig } from '../common/multer/multer.config';
import { SearchUsersDto } from './dto/search-users.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UsersController implements IUsersService {
	constructor(
		private readonly usersService: UsersService
	) {}

	@Get('/:id')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Obtener usuario por id' })
	@ApiParam({ name: 'id', format: 'uuid' })
	@ApiResponse({ status: 200, description: 'Usuario encontrado' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	@ApiResponse({ status: 404, description: 'Usuario no encontrado' })
	findOneById(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') currentUserId: string,
	) {
		return this.usersService.findOneById(id, currentUserId);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Buscar usuarios' })
	@ApiQuery({ name: 'q', required: false, type: String })
	@ApiResponse({ status: 200, description: 'Usuarios encontrados' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	searchUsers(@Query() query: SearchUsersDto) {
		return this.usersService.searchUsers(query.q);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Actualizar datos de usuario' })
	@ApiParam({ name: 'id', format: 'uuid' })
	@ApiResponse({ status: 200, description: 'Usuario actualizado' })
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	@ApiResponse({ status: 403, description: 'No puedes editar este usuario' })
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateUserDto: UpdateUserDto,
		@CurrentUser() currentUser: IUser,
	) {
		if (currentUser.id !== id) {
		    throw new ForbiddenException('No puedes editar este usuario');
		}

		return this.usersService.update(id, updateUserDto);
	}

	@Patch('/:id/profile-image')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('profileImage', profileImageMulterConfig))
	@ApiOperation({ summary: 'Actualizar imagen de perfil' })
	@ApiParam({ name: 'id', format: 'uuid' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				profileImage: { type: 'string', format: 'binary' }
			},
			required: ['profileImage']
		}
	})
	@ApiResponse({ status: 200, description: 'Imagen actualizada' })
	@ApiResponse({ status: 400, description: 'Archivo inválido' })
	@ApiResponse({ status: 401, description: 'Token inválido o ausente' })
	@ApiResponse({ status: 403, description: 'No puedes editar este usuario' })
	updateProfileImage(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser() currentUser: IUser,
		@UploadedFile() profileImage?: Express.Multer.File
	) {
		if (currentUser.id !== id) {
		    throw new ForbiddenException('No puedes editar este usuario');
		}

		return this.usersService.updateProfileImage(id, profileImage);
	}
}
