import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './constants/auth.constant';
import { ROLES_KEY } from './decorators/auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const isPermitted = requiredRoles.some((role) => user.role?.includes(role));

    if (isPermitted) {
      return true;
    }
    throw new UnauthorizedException(
      'Based on your role, you are not authorized to perform this action.',
    );
  }
}
