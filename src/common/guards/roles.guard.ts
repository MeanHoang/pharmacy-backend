import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    // Lấy vai trò yêu cầu từ metadata
    const requiredRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) ||
      this.reflector.get<string[]>('roles', context.getClass());
    if (!requiredRoles) {
      return true; // Nếu không có vai trò yêu cầu thì cho phép truy cập
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('>>> Required roles:', requiredRoles);
    console.log('>>> User payload:', request.user);

    // Kiểm tra xem vai trò của người dùng có khớp với vai trò yêu cầu không
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Bạn không có quyền truy cập!');
    }

    return true;
  }
}
