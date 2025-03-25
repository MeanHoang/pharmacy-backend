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

import { CartItemService } from './cart-item.service';
import { CartItem } from 'src/entities/cart-item.entity';
import { ResponseDto } from 'src/dtos/response.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('cart_id') cart_id?: number,
  ): Promise<ResponseDto<any>> {
    console.log('>>> Call api get cartItem list');
    const result = await this.cartItemService.findAll(page, limit, cart_id);

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
  async create(@Body() cartItemData: any) {
    console.log('>>> Parsed cartItemData:', cartItemData);
    try {
      const newCartItem = await this.cartItemService.create(cartItemData);

      if (!newCartItem)
        return new ResponseDto(
          'error',
          'Lỗi tạo sản phẩm trong giỏ hàng! Kiểm tra lại thông tin',
          null,
        );

      return new ResponseDto(
        'success',
        'Tạo sản phẩm trong giỏ hàng thành công',
        newCartItem,
      );
    } catch (error) {
      console.log('>>> Err create cartItem: ', error);
      return new ResponseDto(
        'error',
        'Lỗi tạo sản phẩm trong giỏ hàng! Kiểm tra lại thông tin',
        null,
      );
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'cartItem')
  @Put(':id')
  async update(
    @Body() cartItemData: Partial<CartItem>,
    @Param('id') id: number,
  ) {
    try {
      const updatedCartItem = await this.cartItemService.update(
        id,
        cartItemData,
      );

      if (updatedCartItem === null) {
        return new ResponseDto(
          'error',
          'Không tìm thấy sản phẩm trong giỏ hàng!',
          null,
        );
      }

      return new ResponseDto(
        'success',
        'Cập nhật thông tin sản phẩm trong giỏ hàng thành công!',
        updatedCartItem,
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
      const isDeleted = await this.cartItemService.delete(id);
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
  async getCartItemByID(@Param('id') id: number) {
    try {
      const cartItem = await this.cartItemService.getCartItemByID(id);
      if (cartItem === null)
        return new ResponseDto(
          'error',
          'Không tìm thấy sản phẩm trong giỏ hàng',
          null,
        );

      return new ResponseDto(
        'success',
        'Lấy thông sản phẩm trong giỏ hàng thành công',
        cartItem,
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
