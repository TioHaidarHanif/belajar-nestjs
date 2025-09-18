jest.mock('bcrypt', () => ({
  compare: jest.fn((a, b) => a === b),
}));
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

const mockUser = { id: 1, username: 'user1', password: 'pass', role: 'member' };

const mockUserService = {
  findByUsername: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue(mockUser),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', async () => {
    const result = await service.validateUser('user1', 'pass');
    expect(result).toBeNull();
    expect(userService.findByUsername).toHaveBeenCalledWith('user1');
  });

  it('should throw UnauthorizedException if user not found', async () => {
    mockUserService.findByUsername.mockResolvedValueOnce(null);
    await expect(service.validateUser('notfound', 'pass')).rejects.toThrow('Invalid credentials');
  });

  it('should throw UnauthorizedException if password is wrong', async () => {
    mockUserService.findByUsername.mockResolvedValueOnce({ ...mockUser, password: 'wrong' });
    await expect(service.validateUser('user1', 'pass')).rejects.toThrow('Invalid credentials');
  });

  it('should login and return accessToken', async () => {
    const result = await service.login({ username: mockUser.username, password: mockUser.password });
    expect(result).toEqual({ accessToken: 'mocked-jwt-token' });
    expect(jwtService.sign).toHaveBeenCalledWith({ username: mockUser.username, sub: mockUser.id });
  });
});
