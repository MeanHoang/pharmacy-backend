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

import { CustomerService } from './customer.service';
import { Customer } from 'src/entities/customer.entity';
import { ResponseDto } from 'src/dtos/response.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'customer')
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('search') search?: string,
  ): Promise<ResponseDto<any>> {
    console.log('>>> Call api get customer list');

    const result = await this.customerService.findAll(page, limit, search);

    return new ResponseDto(
      'success',
      'Tải danh sách khách hàng thành công!',
      result,
    );
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() customer: any,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    console.log('>>>check file avatar: ', avatar);
    try {
      const newCustomer = await this.customerService.create(customer, avatar);

      if (!newCustomer) {
        return new ResponseDto('error', 'Email và SDT đã được sử dụng!', null);
      }

      return new ResponseDto(
        'success',
        'Tạo tài khoản thành công',
        newCustomer,
      );
    } catch (error) {
      return new ResponseDto('error', 'Lỗi tạo tài khoản!', null);
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'customer')
  @Put(':id')
  async update(
    @Body() customerData: Partial<Customer>,
    @Param('id') id: number,
  ) {
    try {
      const updatedCustomer = await this.customerService.update(
        id,
        customerData,
      );

      if (updatedCustomer === null) {
        return new ResponseDto('error', 'Không tìm thấy người dùng!', null);
      }

      return new ResponseDto(
        'success',
        'Cập nhật thông tin người dùng thành công!',
        updatedCustomer,
      );
    } catch (error) {
      return new ResponseDto('error', 'Lỗi cập nhật tài khoản!', null);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const isDeleted = await this.customerService.delete(id);
      console.log('>>> check isDeleted: ', isDeleted);
      if (!isDeleted)
        return new ResponseDto('error', 'Không tìm thấy tài khoản', null);

      return new ResponseDto('success', 'Xóa tài khoản thành công', id);
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy tài khoản', null);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'customer')
  @Get(':id')
  async getCustomerByID(@Param('id') id: number) {
    try {
      const customer = await this.customerService.getCustomerByID(id);
      if (customer === null)
        return new ResponseDto('error', 'Không tìm thấy tài khoản', null);

      return new ResponseDto(
        'success',
        'Lấy thông tài khoản thành công',
        customer,
      );
    } catch (error) {
      return new ResponseDto('error', 'Không tìm thấy tài khoản', null);
    }
  }
}
