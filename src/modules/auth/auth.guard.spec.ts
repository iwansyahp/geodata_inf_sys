import { AuthGuard } from './auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtServiceMock: JwtService;
  let reflectorMock: Reflector;
  let configServiceMock: ConfigService;

  beforeEach(() => {
    jwtServiceMock = {} as JwtService;
    reflectorMock = {} as Reflector;
    configServiceMock = {} as ConfigService;
    guard = new AuthGuard(jwtServiceMock, reflectorMock, configServiceMock);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access for public endpoints', async () => {
    // Mock ExecutionContext
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
      getHandler: () => null,
      getClass: () => null,
    } as ExecutionContext;

    // Mock Reflector to return true for IS_PUBLIC_KEY
    reflectorMock.getAllAndOverride = jest.fn().mockReturnValueOnce(true);

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should allow access when valid token is provided', async () => {
    // Mock ExecutionContext
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid_token_here',
          },
        }),
      }),
      getHandler: () => null,
      getClass: () => null,
    } as ExecutionContext;

    // Mock Reflector to return undefined for IS_PUBLIC_KEY
    reflectorMock.getAllAndOverride = jest.fn().mockReturnValueOnce(undefined);
    configServiceMock.get = jest.fn().mockReturnValueOnce('jwt_secret');
    jwtServiceMock.verifyAsync = jest
      .fn()
      .mockReturnValueOnce({ access_token: 'valid_token_here' });

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException when invalid token is provided', async () => {
    // Mock ExecutionContext
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid_token_here',
          },
        }),
      }),
      getHandler: () => null,
      getClass: () => null,
    } as ExecutionContext;

    // Mock Reflector to return undefined for IS_PUBLIC_KEY
    reflectorMock.getAllAndOverride = jest.fn().mockReturnValueOnce(undefined);

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when no token is provided', async () => {
    // Mock ExecutionContext
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
      getHandler: () => null,
      getClass: () => null,
    } as ExecutionContext;

    // Mock Reflector to return undefined for IS_PUBLIC_KEY
    reflectorMock.getAllAndOverride = jest.fn().mockReturnValueOnce(undefined);

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
