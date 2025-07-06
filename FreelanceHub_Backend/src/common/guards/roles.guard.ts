import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();
    // console.log('👤 User in RolesGuard:', user);
    // console.log('🔐 Required roles:', requiredRoles);
    // console.log('🙋‍♂️ Current user:', user);
    if (!requiredRoles) return true;
    return requiredRoles.includes(user?.role);
  }
}
