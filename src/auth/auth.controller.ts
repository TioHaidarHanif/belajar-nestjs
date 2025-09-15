import {Controller, Post, Body, UseGuards, Get, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
    
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @Post('refresh-token')
    async refreshToken(@Body('userId') userId: number) {
        return this.authService.refreshToken(userId);
    }
    @Post('logout')
    async logout(@Body('userId') userId: number) {
        return this.authService.logout(userId);
    }   
    @UseGuards(AuthGuard('jwt'))
    @Post('protected')
    getProtectedResource() {
        return { message: 'This is a protected resource' };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Req() req) {
        return { message: 'This is the user profile', user: req.user };
    }

}
