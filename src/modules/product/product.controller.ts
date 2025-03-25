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
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { ProductService } from './product.service';
import { Product } from 'src/entities/product.entity';
import { ResponseDto } from 'src/dtos/response.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('search') search?: string,
    @Query('isSales') isSales?: boolean, // truyền 0,1 thì lại ok
  ): Promise<ResponseDto<any>> {
    console.log('>>> Call api get product list');
    const result = await this.productService.findAll(
      page,
      limit,
      search,
      isSales,
    );

    return new ResponseDto(
      'success',
      'Tải danh sách danh mục thành công!',
      result,
    );
  }

  @Post('/create')
  async create(@Body() productData: any) {
    try {
      const newProduct = await this.productService.create(productData);

      return new ResponseDto('success', 'Tạo danh mục thành công', newProduct);
    } catch (error) {
      console.log('>>> Err create product: ', error);
      return new ResponseDto(
        'error',
        'Lỗi tạo danh mục! Kiểm tra lại thông tin',
        null,
      );
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'product')
  @Put(':id')
  async update(@Body() productData: Partial<Product>, @Param('id') id: number) {
    try {
      const updatedProduct = await this.productService.update(id, productData);

      if (updatedProduct === null) {
        return new ResponseDto('error', 'Không tìm thấy danh mục!', null);
      }

      return new ResponseDto(
        'success',
        'Cập nhật thông tin danh mục thành công!',
        updatedProduct,
      );
    } catch (error) {
      return new ResponseDto('error', 'Lỗi cập nhật danh mục!', null);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const isDeleted = await this.productService.delete(id);
      console.log('>>> check isDeleted: ', isDeleted);
      if (!isDeleted)
        return new ResponseDto('error', 'Không tìm thấy danh mục', null);

      return new ResponseDto('success', 'Xóa danh mục thành công', id);
    } catch (error) {
      return new ResponseDto('error', 'Xóa danh mục thất bại', null);
    }
  }

  @Get(':id')
  async getProductByID(@Param('id') id: number) {
    try {
      const product = await this.productService.getProductByID(id);
      if (product === null)
        return new ResponseDto('error', 'Không tìm thấy danh mục', null);

      return new ResponseDto(
        'success',
        'Lấy thông danh mục thành công',
        product,
      );
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy danh mục', null);
    }
  }
}
