import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log('Authorization Header: ', request.headers.authorization);
    const user = request.user;
    console.log(
      `RolesGuard: User role: ${user?.role}, Required roles: ${roles}`
    ); // Log for debugging
    return roles.includes(user?.role);
  }
}
