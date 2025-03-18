import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from '../../dtos/response.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); //Xác thực JWT
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException(
        new ResponseDto('error', 'Bạn vui lòng đăng nhập!', null),
      );
    }

    // Lấy thông tin quyền từ request hoặc từ user đã được decode từ JWT
    const request = context.switchToHttp().getRequest();

    //kiểm tra vai trò
    if (user.role !== 'admin') {
      throw new UnauthorizedException(
        new ResponseDto('error', 'Không có quyền truy cập!', null),
      );
    }

    // Trả về người dùng nếu không có lỗi
    return user;
  }
}
