import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from '../user/user.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {LoginDto} from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<any> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Check if username is being updated and if it already exists
        if (updateProfileDto.username && updateProfileDto.username !== user.username) {
            const existingUser = await this.userService.findByUsername(updateProfileDto.username);
            if (existingUser) {
                throw new UnauthorizedException('Username already exists');
            }
        }

        // Hash password if it's being updated
        const updateData: any = { ...updateProfileDto };
        if (updateProfileDto.password) {
            updateData.password = await bcrypt.hash(updateProfileDto.password, 10);
        }

        const updatedUser = await this.userService.update(userId, updateData);
        
        if (!updatedUser) {
            throw new UnauthorizedException('Failed to update user');
        }

        // Remove sensitive fields from response
        const { password, currentHashedRefreshToken, ...userResponse } = updatedUser as any;
        return userResponse;
    }
}
