import { RolesGuard } from './roles.guard';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './constants/auth.constant';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflectorMock: Reflector;

  beforeEach(() => {
    reflectorMock = {} as Reflector;
    guard = new RolesGuard(reflectorMock);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    // Mock ExecutionContext
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'admin' }, // Mock user with admin role
        }),
      }),
      getHandler: () => null,
      getClass: () => null,
    } as ExecutionContext;

    // Mock Reflector to return undefined for ROLES_KEY
    reflectorMock.getAllAndOverride = jest.fn().mockReturnValueOnce(undefined);

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should allow access when user has required role', () => {
    // Mock ExecutionContext
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'admin' }, // Mock user with admin role
        }),
      }),
      getHandler: () => null,
      getClass: () => null,
    } as ExecutionContext;

    // Mock Reflector to return required roles
    reflectorMock.getAllAndOverride = jest
      .fn()
      .mockReturnValueOnce([Role.Admin]);

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException when user does not have required role', () => {
    // Mock ExecutionContext
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'user' }, // Mock user with user role
        }),
      }),
      getHandler: () => null,
      getClass: () => null,
    } as ExecutionContext;

    // Mock Reflector to return required roles
    reflectorMock.getAllAndOverride = jest
      .fn()
      .mockReturnValueOnce([Role.Admin]);

    // Expect the guard to throw UnauthorizedException
    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });
});
