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

import { ProductImageService } from './product-image.service';
import { ProductImage } from 'src/entities/product-image.entity';
import { ResponseDto } from 'src/dtos/response.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('productImage')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'productImage')
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<ResponseDto<any>> {
    console.log('>>> Call api get productImage list');

    const result = await this.productImageService.findAll(page, limit);

    return new ResponseDto(
      'success',
      'Tải danh sách khách hàng thành công!',
      result,
    );
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() productImage: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    console.log('>>>check file avatar: ', image);
    try {
      const newProductImage = await this.productImageService.create(
        productImage,
        image,
      );

      if (!newProductImage) {
        return new ResponseDto('error', 'Email và SDT đã được sử dụng!', null);
      }

      return new ResponseDto(
        'success',
        'Tạo thông tin hình ảnh thành công',
        newProductImage,
      );
    } catch (error) {
      return new ResponseDto('error', 'Lỗi tạo thông tin hình ảnh!', null);
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'productImage')
  @Put(':id')
  async update(
    @Body() productImageData: Partial<ProductImage>,
    @Param('id') id: number,
  ) {
    try {
      const updatedProductImage = await this.productImageService.update(
        id,
        productImageData,
      );

      if (updatedProductImage === null) {
        return new ResponseDto(
          'error',
          'Không tìm thấy thông tin hình ảnh!',
          null,
        );
      }

      return new ResponseDto(
        'success',
        'Cập nhật thông tin thông tin hình ảnh thành công!',
        updatedProductImage,
      );
    } catch (error) {
      return new ResponseDto('error', 'Lỗi cập nhật thông tin hình ảnh!', null);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const isDeleted = await this.productImageService.delete(id);
      console.log('>>> check isDeleted: ', isDeleted);
      if (!isDeleted)
        return new ResponseDto(
          'error',
          'Không tìm thấy thông tin hình ảnh',
          null,
        );

      return new ResponseDto(
        'success',
        'Xóa thông tin hình ảnh thành công',
        id,
      );
    } catch (error) {
      return new ResponseDto(
        'error',
        'Không tìm thấy thông tin hình ảnh',
        null,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'productImage', 'store')
  @Get(':id')
  async getProductImageByID(@Param('id') id: number) {
    try {
      const productImage =
        await this.productImageService.getProductImageByID(id);
      if (productImage === null)
        return new ResponseDto(
          'error',
          'Không tìm thấy thông tin hình ảnh',
          null,
        );

      return new ResponseDto(
        'success',
        'Lấy thông thông tin hình ảnh thành công',
        productImage,
      );
    } catch (error) {
      return new ResponseDto(
        'error',
        'Không tìm thấy thông tin hình ảnh',
        null,
      );
    }
  }
}
