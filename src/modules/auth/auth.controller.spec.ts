import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../../common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        UsersModule,
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '2 days' },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService], // Include AuthService as a provider
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('logIn', () => {
    it('should return a JWT token on successful login', async () => {
      // Mock the AuthService logIn method
      const mockLoginDto: LoginDto = {
        username: 'testuser',
        password: 'testpassword',
      };
      const mockJwtToken = { access_token: 'mock.jwt.token' };
      jest.spyOn(authService, 'logIn').mockResolvedValue(mockJwtToken);

      // Call the controller method
      const result = await controller.logIn(mockLoginDto);

      // Assert the result
      expect(result).toEqual({ data: mockJwtToken });
    });

    it('should return 401 Unauthorized for invalid credentials', async () => {
      // Mock the AuthService logIn method to throw a UnauthorizedException for invalid credentials

      // Call the controller method with invalid credentials
      const loginDto = { username: 'invalidUser', password: 'invalidPassword' };

      // Assert that the controller returns a 401 Unauthorized response
      await expect(controller.logIn(loginDto)).rejects.toThrowError(
        new UnauthorizedException('Unauthorized'),
      );
    });
  });

  describe('getUser', () => {
    it('should return the current user token information', () => {
      // Mock the request object
      const mockUser = { id: 1, username: 'testuser' };
      const mockReq = { user: mockUser };

      // Call the controller method
      const result = controller.getUser(mockReq);

      // Assert the result
      expect(result).toEqual({ data: mockUser });
    });

    it('should return the non user token information', () => {
      // Mock the request object
      const mockReq = { user: {} };

      // Call the controller method
      const result = controller.getUser(mockReq);

      // Assert the result
      expect(result).toEqual({ data: {} });
    });
  });
});
