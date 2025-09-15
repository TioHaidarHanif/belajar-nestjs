import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from '../user/user.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {LoginDto} from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}
    async register(userDto: Partial<RegisterDto >): Promise<any> {
        if (!userDto.password) {
            throw new UnauthorizedException('Password is required');
        }
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        const user = await this.userService.create({ ...userDto, password: hashedPassword });
        return user;
    }
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return null;
    }
    async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.userService.findByUsername(loginDto.username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }   
    async refreshToken(userId: number): Promise<{ accessToken: string }> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('Invalid user');
        }
        const payload = { username: user.username, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async logout(userId: number): Promise<void> {
        await this.userService.removeRefreshToken(userId);
    }
}
