import {
  Controller,
  Post,
  Get,
  Body,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { StoreAuthService } from './store-auth.service';
import { LoginStoreDto } from 'src/dtos/login-store.dto';
import { ResponseDto } from '../../../dtos/response.dto';

@Controller('store/auth')
export class StoreAuthController {
  constructor(private readonly adminAuthService: StoreAuthService) {}

  @Post('login')
  async login(@Body() body: LoginStoreDto): Promise<ResponseDto<any>> {
    try {
      console.log('>>>check body: ', body);

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
