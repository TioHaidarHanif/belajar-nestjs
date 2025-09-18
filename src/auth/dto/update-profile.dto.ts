import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional({
        description: 'New username for the user',
        example: 'john_doe_updated'
    })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional({
        description: 'New email address for the user',
        example: 'john.updated@example.com'
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        description: 'New password for the user (minimum 6 characters)',
        example: 'newpassword123',
        minLength: 6
    })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}