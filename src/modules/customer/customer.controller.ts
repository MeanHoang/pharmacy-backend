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
} from '@nestjs/common';

import { CustomerService } from './customer.service';
import { Customer } from 'src/entities/customer.entity';
import { ResponseDto } from 'src/dtos/response.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
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
  async create(@Body() customer: Customer) {
    console.log('>>>check body: ', customer);
    try {
      const newCustomer = await this.customerService.create(customer);

      if (!newCustomer) {
        return new ResponseDto('error', 'Tên tài khoản đã được sử dụng!', null);
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
}
