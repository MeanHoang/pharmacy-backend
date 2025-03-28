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

import { OrderItemService } from './order-item.service';
import { OrderItem } from 'src/entities/order-item.entity';
import { ResponseDto } from 'src/dtos/response.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('order_id') order_id?: number,
  ): Promise<ResponseDto<any>> {
    console.log('>>> Call api get orderItem list');
    const result = await this.orderItemService.findAll(page, limit, order_id);

    if (!result)
      return new ResponseDto(
        'failed',
        'Tải danh sách sản phẩm trong giỏ hàng thất bại!',
        result,
      );
    // console.log('check result: ', result);

    return new ResponseDto(
      'success',
      'Tải danh sách sản phẩm trong giỏ hàng thành công!',
      result,
    );
  }

  @Post('/create')
  async create(@Body() orderItemData: any) {
    console.log('>>> Parsed orderItemData:', orderItemData);
    try {
      const newOrderItem = await this.orderItemService.create(orderItemData);

      if (!newOrderItem)
        return new ResponseDto(
          'error',
          'Lỗi tạo sản phẩm trong giỏ hàng! Kiểm tra lại thông tin',
          null,
        );

      return new ResponseDto(
        'success',
        'Tạo sản phẩm trong giỏ hàng thành công',
        newOrderItem,
      );
    } catch (error) {
      console.log('>>> Err create orderItem: ', error);
      return new ResponseDto(
        'error',
        'Lỗi tạo sản phẩm trong giỏ hàng! Kiểm tra lại thông tin',
        null,
      );
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'orderItem')
  @Put(':id')
  async update(
    @Body() orderItemData: Partial<OrderItem>,
    @Param('id') id: number,
  ) {
    try {
      const updatedOrderItem = await this.orderItemService.update(
        id,
        orderItemData,
      );

      if (updatedOrderItem === null) {
        return new ResponseDto(
          'error',
          'Không tìm thấy sản phẩm trong giỏ hàng!',
          null,
        );
      }

      return new ResponseDto(
        'success',
        'Cập nhật thông tin sản phẩm trong giỏ hàng thành công!',
        updatedOrderItem,
      );
    } catch (error) {
      return new ResponseDto(
        'error',
        'Lỗi cập nhật sản phẩm trong giỏ hàng!',
        null,
      );
    }
  }

  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const isDeleted = await this.orderItemService.delete(id);
      console.log('>>> check isDeleted: ', isDeleted);
      if (!isDeleted)
        return new ResponseDto(
          'error',
          'Không tìm thấy sản phẩm trong giỏ hàng',
          null,
        );

      return new ResponseDto(
        'success',
        'Xóa sản phẩm trong giỏ hàng thành công',
        id,
      );
    } catch (error) {
      return new ResponseDto(
        'error',
        'Xóa sản phẩm trong giỏ hàng thất bại',
        null,
      );
    }
  }

  @Get(':id')
  async getOrderItemByID(@Param('id') id: number) {
    try {
      const orderItem = await this.orderItemService.getOrderItemByID(id);
      if (orderItem === null)
        return new ResponseDto(
          'error',
          'Không tìm thấy sản phẩm trong giỏ hàng',
          null,
        );

      return new ResponseDto(
        'success',
        'Lấy thông sản phẩm trong giỏ hàng thành công',
        orderItem,
      );
    } catch (error) {
      return new ResponseDto(
        'error',
        'Không tìm thấy sản phẩm trong giỏ hàng',
        null,
      );
    }
  }
}
