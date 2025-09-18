import {IsString, MinLength, MaxLength, Matches, IsOptional, IsEmail} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        description: 'Username for registration',
        example: 'john_doe'
    })
    @IsString()
    username: string;
    
    @ApiProperty({
        description: 'Password for registration (minimum 6 characters)',
        example: 'password123',
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    password: string;
    
    @ApiPropertyOptional({
        description: 'Email address (optional)',
        example: 'john@example.com'
    })
    @IsOptional()
    @IsEmail()
    email?: string; 
}