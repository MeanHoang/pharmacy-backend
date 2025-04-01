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

    if (!result)
      return new ResponseDto(
        'failed',
        'Tải danh sách sản phẩm thất bại!',
        result,
      );
    // console.log('check result: ', result);

    return new ResponseDto(
      'success',
      'Tải danh sách sản phẩm thành công!',
      result,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() productData: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    // console.log('>>> Check productData controller:', productData);
    try {
      const newProduct = await this.productService.create(productData, image);

      if (!newProduct)
        return new ResponseDto(
          'error',
          'Lỗi tạo sản phẩm! Kiểm tra lại thông tin',
          null,
        );

      return new ResponseDto('success', 'Tạo sản phẩm thành công', newProduct);
    } catch (error) {
      console.log('>>> Err create product: ', error);
      return new ResponseDto(
        'error',
        'Lỗi tạo sản phẩm! Kiểm tra lại thông tin',
        null,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(@Body() productData: Partial<Product>, @Param('id') id: number) {
    try {
      const updatedProduct = await this.productService.update(id, productData);

      if (updatedProduct === null) {
        return new ResponseDto('error', 'Không tìm thấy sản phẩm!', null);
      }

      return new ResponseDto(
        'success',
        'Cập nhật thông tin sản phẩm thành công!',
        updatedProduct,
      );
    } catch (error) {
      return new ResponseDto('error', 'Lỗi cập nhật sản phẩm!', null);
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
        return new ResponseDto('error', 'Không tìm thấy sản phẩm', null);

      return new ResponseDto('success', 'Xóa sản phẩm thành công', id);
    } catch (error) {
      return new ResponseDto('error', 'Xóa sản phẩm thất bại', null);
    }
  }

  @Get(':id')
  async getProductByID(@Param('id') id: number) {
    try {
      const product = await this.productService.getProductByID(id);
      if (product === null)
        return new ResponseDto('error', 'Không tìm thấy sản phẩm', null);

      return new ResponseDto(
        'success',
        'Lấy thông sản phẩm thành công',
        product,
      );
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy sản phẩm', null);
    }
  }

  @Patch('/status/:id')
  async updateStatus(@Param('id') id: number): Promise<ResponseDto<any>> {
    try {
      const updatedProduct = await this.productService.updateStatus(id);

      if (!updatedProduct) {
        return new ResponseDto('error', 'Không tìm thấy sản phẩm!', null);
      }

      return new ResponseDto(
        'success',
        'Cập nhật trạng thái sản phẩm thành công!',
        updatedProduct,
      );
    } catch (error) {
      return new ResponseDto('error', 'Lỗi cập nhật trạng thái!', null);
    }
  }
}
