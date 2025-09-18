import {Controller, Post, Body, UseGuards, Get, Req, Put} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { Counter } from 'prom-client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

const authCounter = new Counter({
    name: 'auth_requests_total',
    help: 'Total number of authentication requests',
    labelNames: ['perintah', 'status'],
});

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ 
        status: 201, 
        description: 'User successfully registered',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'john_doe' },
                email: { type: 'string', example: 'john@example.com' },
                role: { type: 'string', example: 'member' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
    
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ 
        status: 200, 
        description: 'User successfully logged in',
        schema: {
            type: 'object',
            properties: {
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
                authCounter.inc({ perintah: 'Login brow', status: 'success' });

        return this.authService.login(loginDto);
    }
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'number', example: 1 }
            }
        }
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Token successfully refreshed',
        schema: {
            type: 'object',
            properties: {
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
        }
    })
    @Post('refresh-token')
    async refreshToken(@Body('userId') userId: number) {
        return this.authService.refreshToken(userId);
    }

    @ApiOperation({ summary: 'Logout user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'number', example: 1 }
            }
        }
    })
    @ApiResponse({ status: 200, description: 'User successfully logged out' })
    @Post('logout')
    async logout(@Body('userId') userId: number) {
        return this.authService.logout(userId);
    }   

    @ApiOperation({ summary: 'Access protected resource' })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ 
        status: 200, 
        description: 'Protected resource accessed',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'This is a protected resource' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(AuthGuard('jwt'))
    @Post('protected')
    getProtectedResource() {
        return { message: 'This is a protected resource' };
    }

    @ApiOperation({ summary: 'Get user profile' })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ 
        status: 200, 
        description: 'User profile retrieved',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'This is the user profile' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        username: { type: 'string', example: 'john_doe' }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Req() req) {
        authCounter.inc({ perintah: 'Lihat profil', status: 'success' });
        return { message: 'This is the user profile', user: req.user };
    }

    @ApiOperation({ summary: 'Update user profile' })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({ 
        status: 200, 
        description: 'User profile updated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'john_doe_updated' },
                email: { type: 'string', example: 'john.updated@example.com' },
                role: { type: 'string', example: 'member' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Bad Request - Username already exists or invalid data' })
    @UseGuards(AuthGuard('jwt'))
    @Put('profile')
    async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
        // @ts-ignore
        return this.authService.updateProfile(req.user.id, updateProfileDto);
    }

}
