import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ResponseDto } from '../../dtos/response.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); //Xac thuc JWT
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    //Debug
    // const req = context.switchToHttp().getRequest();
    // console.log('>>> check e JWT:', req.headers.authorization);
    // console.log('>>> check e User:', user);
    // console.log('>>> check e Info:', info);

    if (err || !user) {
      throw new UnauthorizedException(
        new ResponseDto('error', 'Bạn vui lòng đăng nhập!', null),
      );
    }
    return user;
  }
}
