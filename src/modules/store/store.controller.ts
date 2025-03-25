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
import { StoreService } from './store.service';
import { Store } from '../../entities/store.entity';
import { ResponseDto } from '../../dtos/response.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('store')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('store', 'admin')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('store')
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('search') search?: string,
  ): Promise<ResponseDto<any>> {
    console.log('>>> Call API GET list store!');

    const result = await this.storeService.findAll(page, limit, search);

    return new ResponseDto(
      'success',
      'Tải danh sách cửa hàng thành công!',
      result,
    );
  }

  @Post('/create')
  async create(@Body() store: Store) {
    try {
      const newStore = await this.storeService.create(store);

      if (!newStore) {
        return new ResponseDto('error', 'Tên tài khoản đã được sử dụng!', null);
      }

      return new ResponseDto('success', 'Tạo tài khoản thành công', newStore);
    } catch (error) {
      return new ResponseDto('error', 'Lỗi tạo tài khoản!', null);
    }
  }

  @Put(':id')
  async update(@Body() storeData: Partial<Store>, @Param('id') id: number) {
    try {
      const updatedStore = await this.storeService.update(id, storeData);

      if (updatedStore === null) {
        return new ResponseDto(
          'error',
          'Không tìm thấy store cần cập nhật!',
          null,
        );
      }

      if (updatedStore === 'duplicate') {
        return new ResponseDto('error', 'Tên đăng nhập đã tồn tại!', null);
      }

      return new ResponseDto(
        'success',
        'Cập nhật store thành công!',
        updatedStore,
      );
    } catch (error) {
      return new ResponseDto('error', 'Lỗi cập nhật tài khoản!', null);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const isDeleted = await this.storeService.delete(id);
      console.log('>>> check isDeleted: ', isDeleted);
      if (!isDeleted)
        return new ResponseDto('error', 'Không tìm thấy tài khoản', null);

      return new ResponseDto('success', 'Xóa tài khoản thành công', id);
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy tài khoản', null);
    }
  }

  @Get(':id')
  async getStoreByID(@Param('id') id: number) {
    try {
      const store = await this.storeService.getStoreByID(id);
      if (store === null)
        return new ResponseDto('error', 'Không tìm thấy tài khoản', null);

      return new ResponseDto(
        'success',
        'Lấy thông tài khoản thành công',
        store,
      );
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy tài khoản', null);
    }
  }

  @Patch('/reset-password/:id')
  async resetPassword(@Param('id') id: number): Promise<ResponseDto<any>> {
    const store = await this.storeService.resetPassword(id);

    if (store === null) {
      return new ResponseDto('error', 'Store không tồn tại!', null);
    }

    return new ResponseDto('success', 'Reset mật khẩu thành công!', store);
  }
}
