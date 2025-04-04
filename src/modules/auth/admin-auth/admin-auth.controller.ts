import {
  Controller,
  Post,
  Get,
  Body,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { AdminAuthService } from './admin-auth.service';
import { LoginAdminDto } from '../../../dtos/login-admin.dto';
import { ResponseDto } from '../../../dtos/response.dto';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  async login(@Body() body: LoginAdminDto): Promise<ResponseDto<any>> {
    try {
      if (!body.username || !body.password) {
        return new ResponseDto(
          'error',
          'Tên tài khoản và mật khẩu không được để trống',
          null,
        );
      }

      const result = await this.adminAuthService.login(
        body.username,
        body.password,
      );

      console.log('>>> check result in sv: ', result);

      return result;
    } catch (error) {
      console.error('Error in login controller:', error);
      throw new InternalServerErrorException(
        'Lỗi server khi thực hiện đăng nhập',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile() {
    return { message: 'Bạn đã xác thực thành công!' };
  }
}
