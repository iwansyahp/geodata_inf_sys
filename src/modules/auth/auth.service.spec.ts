import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMock: Partial<UsersService>;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(async () => {
    usersServiceMock = {
      findOneByUserName: jest.fn(),
    };

    jwtServiceMock = {
      signAsync: jest.fn().mockResolvedValue('mocked_token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logIn', () => {
    it('should return a valid JWT token for valid credentials', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { id: 1, username, password: hashedPassword, role: 'user' };

      usersServiceMock.findOneByUserName = jest.fn().mockResolvedValue(user);

      const result = await service.logIn(username, password);

      expect(result.access_token).toEqual('mocked_token');
    });

    it('should throw UnauthorizedException for invalid username', async () => {
      const username = 'invaliduser';
      const password = 'testpassword';

      usersServiceMock.findOneByUserName = jest.fn().mockResolvedValue(null);

      await expect(service.logIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const username = 'testuser';
      const password = 'invalidpassword';
      const hashedPassword = await bcrypt.hash('testpassword', 10);
      const user = { id: 1, username, password: hashedPassword, role: 'user' };

      usersServiceMock.findOneByUserName = jest.fn().mockResolvedValue(user);

      await expect(service.logIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    // Add more negative test cases for empty/null username, empty/null password, etc.
    it('should throw UnauthorizedException for empty username', async () => {
      const username = '';
      const password = 'testpassword';

      await expect(service.logIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for empty password', async () => {
      const username = 'testuser';
      const password = '';

      await expect(service.logIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for null username', async () => {
      const username = null;
      const password = 'testpassword';

      await expect(service.logIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for null password', async () => {
      const username = 'testuser';
      const password = null;

      await expect(service.logIn(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
