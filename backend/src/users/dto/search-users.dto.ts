import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchUsersDto {
    @ApiPropertyOptional({ example: 'lucas' })
    @IsOptional()
    @IsString()
    q?: string;
}
