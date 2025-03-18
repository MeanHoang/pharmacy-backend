import {
  Controller,
  Post,
  Get,
  Body,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { CustomerAuthService } from './customer-auth.service';
import { LoginCustomerDto } from 'src/dtos/login-customer.dto';
import { ResponseDto } from '../../../dtos/response.dto';

@Controller('customer/auth')
export class CustomerAuthController {
  constructor(private readonly adminAuthService: CustomerAuthService) {}

  @Post('login')
  async login(@Body() body: LoginCustomerDto): Promise<ResponseDto<any>> {
    try {
      console.log('>>>check body: ', body);
      if (!body.email || !body.password) {
        return new ResponseDto(
          'error',
          'Email và mật khẩu không được để trống',
          null,
        );
      }

      const result = await this.adminAuthService.login(
        body.email,
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
