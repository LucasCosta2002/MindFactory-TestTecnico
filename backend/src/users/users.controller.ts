import { Controller, Get, Body, Patch, Param, ParseUUIDPipe, UseGuards, ForbiddenException, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { IUsersService } from './IUsersService';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUser } from '../common/types';
import { profileImageMulterConfig } from '../common/multer/multer.config';
import { SearchUsersDto } from './dto/search-users.dto';

@Controller('user')
export class UsersController implements IUsersService {
	constructor(
		private readonly usersService: UsersService
	) {}

	@Get('/:id')
	@UseGuards(JwtAuthGuard)
	findOneById(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser('id') currentUserId: string,
	) {
		return this.usersService.findOneById(id, currentUserId);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	searchUsers(@Query() query: SearchUsersDto) {
		return this.usersService.searchUsers(query.q);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
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
