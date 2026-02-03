import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class InfinitePaginationDto {
    @ApiPropertyOptional({ example: 10, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ example: 'cursor-id' })
    @IsOptional()
    @IsString()
    cursor?: string;

    @ApiPropertyOptional({ example: 'busqueda' })
    @IsOptional()
    @IsString()
    search?: string;
}
