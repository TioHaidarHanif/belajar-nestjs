import {IsString, MinLength, MaxLength, Matches, IsOptional, IsEmail} from 'class-validator';

export class RegisterDto {
    @IsString()
    username: string;
    
    @IsString()
    @MinLength(6)
    password: string;
    
    @IsOptional()
    @IsEmail()
    email?: string; 
}