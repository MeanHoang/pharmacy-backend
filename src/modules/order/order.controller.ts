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
  Search,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { OrderService } from './order.service';
import { Order } from 'src/entities/order.entity';
import { ResponseDto } from 'src/dtos/response.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('customer_id') customer_id?: number,
  ): Promise<ResponseDto<any>> {
    console.log('>>> Call api get order list');
    const result = await this.orderService.findAll(page, limit, customer_id);

    if (!result)
      return new ResponseDto(
        'failed',
        'Tải danh sách đơn hàng thất bại!',
        result,
      );
    // console.log('check result: ', result);

    return new ResponseDto(
      'success',
      'Tải danh sách đơn hàng thành công!',
      result,
    );
  }

  @Post('/create')
  async create(@Body() orderData: any) {
    console.log('>>> Parsed orderData:', orderData);
    try {
      const newOrder = await this.orderService.create(orderData);

      if (!newOrder)
        return new ResponseDto(
          'error',
          'Lỗi tạo đơn hàng! Kiểm tra lại thông tin',
          null,
        );

      return new ResponseDto('success', 'Tạo đơn hàng thành công', newOrder);
    } catch (error) {
      console.log('>>> Err create order: ', error);
      return new ResponseDto(
        'error',
        'Lỗi tạo đơn hàng! Kiểm tra lại thông tin',
        null,
      );
    }
  }

  //   // @UseGuards(JwtAuthGuard, RolesGuard)
  //   // @Roles('admin', 'order')
  @Put(':id')
  async update(@Body() orderData: Partial<Order>, @Param('id') id: number) {
    try {
      const updatedOrder = await this.orderService.update(id, orderData);

      if (updatedOrder === null) {
        return new ResponseDto('error', 'Không tìm thấy đơn hàng!', null);
      }

      return new ResponseDto(
        'success',
        'Cập nhật thông tin đơn hàng thành công!',
        updatedOrder,
      );
    } catch (error) {
      return new ResponseDto('error', 'Lỗi cập nhật đơn hàng!', null);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const isDeleted = await this.orderService.delete(id);
      console.log('>>> check isDeleted: ', isDeleted);
      if (!isDeleted)
        return new ResponseDto('error', 'Không tìm thấy đơn hàng', null);

      return new ResponseDto('success', 'Xóa đơn hàng thành công', id);
    } catch (error) {
      return new ResponseDto('error', 'Xóa đơn hàng thất bại', null);
    }
  }

  @Get(':id')
  async getOrderByID(@Param('id') id: number) {
    try {
      const order = await this.orderService.getOrderByID(id);
      if (order === null)
        return new ResponseDto('error', 'Không tìm thấy đơn hàng', null);

      return new ResponseDto('success', 'Lấy thông đơn hàng thành công', order);
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy đơn hàng', null);
    }
  }
}
