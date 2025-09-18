import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTodoDto {
    @ApiProperty({
        description: 'Title of the todo item',
        example: 'Complete project documentation'
    })
    @IsString()
    title: string;

    @ApiPropertyOptional({
        description: 'Description of the todo item',
        example: 'Write comprehensive API documentation with examples'
    })
    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateTodoDto {
    @ApiPropertyOptional({
        description: 'Title of the todo item',
        example: 'Updated project documentation'
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        description: 'Description of the todo item',
        example: 'Updated description for the todo'
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: 'Whether the todo is completed',
        example: true
    })
    @IsOptional()
    @IsBoolean()
    isDone?: boolean;
}