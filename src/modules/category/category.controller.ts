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

import { CategoryService } from './category.service';
import { Category } from 'src/entities/category.entity';
import { ResponseDto } from 'src/dtos/response.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('search') search?: string,
    @Query('isSales') isSales?: boolean, // truyền 0,1 thì lại ok
  ): Promise<ResponseDto<any>> {
    console.log('>>> Call api get category list');
    const result = await this.categoryService.findAll(
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
  async create(@Body() categoryData: any) {
    try {
      const newCategory = await this.categoryService.create(categoryData);

      return new ResponseDto('success', 'Tạo danh mục thành công', newCategory);
    } catch (error) {
      console.log('>>> Err create category: ', error);
      return new ResponseDto(
        'error',
        'Lỗi tạo danh mục! Kiểm tra lại thông tin',
        null,
      );
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'category')
  @Put(':id')
  async update(
    @Body() categoryData: Partial<Category>,
    @Param('id') id: number,
  ) {
    try {
      const updatedCategory = await this.categoryService.update(
        id,
        categoryData,
      );

      if (updatedCategory === null) {
        return new ResponseDto('error', 'Không tìm thấy danh mục!', null);
      }

      return new ResponseDto(
        'success',
        'Cập nhật thông tin danh mục thành công!',
        updatedCategory,
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
      const isDeleted = await this.categoryService.delete(id);
      console.log('>>> check isDeleted: ', isDeleted);
      if (!isDeleted)
        return new ResponseDto('error', 'Không tìm thấy danh mục', null);

      return new ResponseDto('success', 'Xóa danh mục thành công', id);
    } catch (error) {
      return new ResponseDto('error', 'Xóa danh mục thất bại', null);
    }
  }

  @Get(':id')
  async getCategoryByID(@Param('id') id: number) {
    try {
      const category = await this.categoryService.getCategoryByID(id);
      if (category === null)
        return new ResponseDto('error', 'Không tìm thấy danh mục', null);

      return new ResponseDto(
        'success',
        'Lấy thông danh mục thành công',
        category,
      );
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy danh mục', null);
    }
  }
}
