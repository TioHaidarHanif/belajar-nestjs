import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateArticleDto {
    @ApiProperty({
        description: 'Title of the article',
        example: 'Introduction to NestJS'
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Content of the article',
        example: 'NestJS is a framework for building efficient, scalable Node.js server-side applications...'
    })
    @IsString()
    content: string;
}

export class UpdateArticleDto {
    @ApiPropertyOptional({
        description: 'Title of the article',
        example: 'Updated: Introduction to NestJS'
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({
        description: 'Content of the article',
        example: 'Updated content about NestJS framework...'
    })
    @IsOptional()
    @IsString()
    content?: string;
}