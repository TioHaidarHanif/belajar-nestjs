import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
    

    findById(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }
    findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOneBy({ username });
    }
    
    create(user: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }

    async update(id: number, data: Partial<User>): Promise<User | null> {
        await this.userRepository.update(id, data);
        return this.userRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
    async setCurrentRefreshToken(refreshToken: string, userId: number): Promise<void> {
        await this.userRepository.update(userId, {
            currentHashedRefreshToken: refreshToken,
        });
    }
    
    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (user && user.currentHashedRefreshToken === refreshToken) {
            return user;
        }
        return null;
    }

    async removeRefreshToken(userId: number): Promise<void> {
        await this.userRepository.update(userId, {
            currentHashedRefreshToken: undefined
        });
    }
}