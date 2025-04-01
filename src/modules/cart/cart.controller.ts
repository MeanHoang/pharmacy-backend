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

import { CartService } from './cart.service';
import { Cart } from 'src/entities/cart.entity';
import { ResponseDto } from 'src/dtos/response.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'store')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('customer_id') customer_id?: number,
  ): Promise<ResponseDto<any>> {
    console.log('>>> Call api get cart list');
    const result = await this.cartService.findAll(page, limit, customer_id);

    if (!result)
      return new ResponseDto(
        'failed',
        'Tải danh sách giỏ hàng thất bại!',
        result,
      );
    // console.log('check result: ', result);

    return new ResponseDto(
      'success',
      'Tải danh sách giỏ hàng thành công!',
      result,
    );
  }

  @Post('/create')
  async create(@Body() cartData: any) {
    console.log('>>> Parsed cartData:', cartData);
    try {
      const newCart = await this.cartService.create(cartData);

      if (!newCart)
        return new ResponseDto(
          'error',
          'Lỗi tạo giỏ hàng! Kiểm tra lại thông tin',
          null,
        );

      return new ResponseDto('success', 'Tạo giỏ hàng thành công', newCart);
    } catch (error) {
      console.log('>>> Err create cart: ', error);
      return new ResponseDto(
        'error',
        'Lỗi tạo giỏ hàng! Kiểm tra lại thông tin',
        null,
      );
    }
  }

  //   // @UseGuards(JwtAuthGuard, RolesGuard)
  //   // @Roles('admin', 'store')
  //   @Put(':id')
  //   async update(@Body() cartData: Partial<Cart>, @Param('id') id: number) {
  //     try {
  //       const updatedCart = await this.cartService.update(id, cartData);

  //       if (updatedCart === null) {
  //         return new ResponseDto('error', 'Không tìm thấy giỏ hàng!', null);
  //       }

  //       return new ResponseDto(
  //         'success',
  //         'Cập nhật thông tin giỏ hàng thành công!',
  //         updatedCart,
  //       );
  //     } catch (error) {
  //       return new ResponseDto('error', 'Lỗi cập nhật giỏ hàng!', null);
  //     }
  //   }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const isDeleted = await this.cartService.delete(id);
      console.log('>>> check isDeleted: ', isDeleted);
      if (!isDeleted)
        return new ResponseDto('error', 'Không tìm thấy giỏ hàng', null);

      return new ResponseDto('success', 'Xóa giỏ hàng thành công', id);
    } catch (error) {
      return new ResponseDto('error', 'Xóa giỏ hàng thất bại', null);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'store', 'customer')
  @Get(':id')
  async getCartByID(@Param('id') id: number) {
    try {
      const cart = await this.cartService.getCartByID(id);
      if (cart === null)
        return new ResponseDto('error', 'Không tìm thấy giỏ hàng', null);

      return new ResponseDto('success', 'Lấy thông giỏ hàng thành công', cart);
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy giỏ hàng', null);
    }
  }
}
