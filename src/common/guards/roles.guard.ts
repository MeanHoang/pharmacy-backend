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
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // Nếu không có vai trò yêu cầu thì cho phép truy cập
    }

    const { role } = context.switchToHttp().getRequest().user;

    console.log('>>>check role: ', role);

    // Kiểm tra xem vai trò của người dùng có khớp với vai trò yêu cầu không
    if (!roles.includes(role)) {
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }

    return true;
  }
}
