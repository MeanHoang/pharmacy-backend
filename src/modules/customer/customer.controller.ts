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

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

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
}
