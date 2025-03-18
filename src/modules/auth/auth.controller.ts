import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AdminAuthService } from './admin-auth/admin-auth.service';
import { CustomerAuthService } from './customer-auth/customer-auth.service';
import { LoginAdminDto } from '../../dtos/login-admin.dto';
import { LoginCustomerDto } from '../../dtos/login-customer.dto';
import { ResponseDto } from '../../dtos/response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly customerAuthService: CustomerAuthService,
  ) {}

  // Đăng nhập cho Admin
  @Post('admin/login')
  async adminLogin(@Body() body: LoginAdminDto): Promise<ResponseDto<any>> {
    try {
      const result = await this.adminAuthService.login(
        body.username,
        body.password,
      );
      if (!result) {
        return new ResponseDto('error', 'Nhập đầy đủ vào', null);
      }

      return new ResponseDto('success', 'Đăng nhập thành công!', result);
    } catch (error) {
      return new ResponseDto('error', 'Đăng nhập thất bại', null);
    }
  }

  // Đăng nhập cho Customer
  @Post('customer/login')
  async customerLogin(
    @Body() body: LoginCustomerDto,
  ): Promise<ResponseDto<any>> {
    try {
      if (!body.email || !body.password) {
        return new ResponseDto('error', 'Nhập đầy đủ vào', null);
      }

      const result = await this.customerAuthService.login(
        body.email,
        body.password,
      );

      return new ResponseDto('success', 'Đăng nhập thành công!', result);
    } catch (error) {
      return new ResponseDto('error', 'Đặng nhập thất bại!', null);
    }
  }
}
