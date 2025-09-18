import {IsString} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Username for login',
        example: 'john_doe'
    })
    @IsString()
    username: string;
    
    @ApiProperty({
        description: 'Password for login',
        example: 'password123'
    })
    @IsString()
    password: string;
}
