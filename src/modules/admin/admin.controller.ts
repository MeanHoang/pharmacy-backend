import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from '../../entities/admin.entity';
import { ResponseDto } from '../../dtos/response.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('search') search?: string,
  ): Promise<ResponseDto<any>> {
    console.log('>>> Call API GET list admin!');

    const result = await this.adminService.findAll(page, limit, search);

    return new ResponseDto(
      'success',
      'Tải danh sách người dùng thành công!',
      result,
    );
  }

  @Post('/create')
  async create(@Body() admin: Admin) {
    try {
      const newAdmin = await this.adminService.create(admin);

      if (!newAdmin) {
        return new ResponseDto('error', 'Tên tài khoản đã được sử dụng!', null);
      }

      return new ResponseDto('success', 'Tạo tài khoản thành công', newAdmin);
    } catch (error) {
      return new ResponseDto('error', 'Lỗi tạo tài khoản!', null);
    }
  }

  @Put(':id')
  async update(@Body() adminData: Partial<Admin>, @Param('id') id: number) {
    try {
      const updatedAdmin = await this.adminService.update(id, adminData);

      if (updatedAdmin === null) {
        return new ResponseDto(
          'error',
          'Không tìm thấy admin cần cập nhật!',
          null,
        );
      }

      if (updatedAdmin === 'duplicate') {
        return new ResponseDto('error', 'Tên đăng nhập đã tồn tại!', null);
      }

      return new ResponseDto(
        'success',
        'Cập nhật admin thành công!',
        updatedAdmin,
      );
    } catch (error) {
      return new ResponseDto('error', 'Lỗi cập nhật tài khoản!', null);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const isDeleted = await this.adminService.delete(id);
      console.log('>>> check isDeleted: ', isDeleted);
      if (!isDeleted)
        return new ResponseDto('error', 'Không tìm thấy tài khoản', null);

      return new ResponseDto('success', 'Xóa tài khoản thành công', id);
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy tài khoản', null);
    }
  }

  @Get(':id')
  async getAdminByID(@Param('id') id: number) {
    try {
      const admin = await this.adminService.getAdminByID(id);
      if (admin === null)
        return new ResponseDto('error', 'Không tìm thấy tài khoản', null);

      return new ResponseDto(
        'success',
        'Lấy thông tài khoản thành công',
        admin,
      );
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy tài khoản', null);
    }
  }

  @Patch('/reset-password/:id')
  async resetPassword(@Param('id') id: number): Promise<ResponseDto<any>> {
    const admin = await this.adminService.resetPassword(id);

    if (admin === null) {
      return new ResponseDto('error', 'Admin không tồn tại!', null);
    }

    return new ResponseDto('success', 'Reset mật khẩu thành công!', admin);
  }
}
