import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomerAddressService } from './customer-address.service';
import { CustomerAddress } from '../../entities/customer-address.entity';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { ResponseDto } from '../../dtos/response.dto';

@Controller('customer-address')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('admin', 'customer')
export class CustomerAddressController {
  constructor(
    private readonly customerAddressService: CustomerAddressService,
  ) {}

  @Get()
  async findAll(
    @Query('customer_id') customer_id: number,
  ): Promise<ResponseDto<CustomerAddress[]>> {
    try {
      const addresses = await this.customerAddressService.findAll(customer_id);
      return new ResponseDto(
        'success',
        'Tải danh sách địa chỉ thành công!',
        addresses,
      );
    } catch (error) {
      throw new HttpException(
        new ResponseDto('error', 'Lỗi lấy danh sách địa chỉ', null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(
    @Body() address: CustomerAddress,
  ): Promise<ResponseDto<CustomerAddress>> {
    try {
      const newAddress = await this.customerAddressService.create(address);
      return new ResponseDto('success', 'Thêm địa chỉ thành công', newAddress);
    } catch (error) {
      throw new HttpException(
        new ResponseDto('error', 'Lỗi khi thêm địa chỉ', null),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() address: Partial<CustomerAddress>,
  ): Promise<ResponseDto<CustomerAddress>> {
    try {
      const updatedAddress = await this.customerAddressService.update(
        id,
        address,
      );
      if (!updatedAddress)
        throw new HttpException(
          new ResponseDto('error', 'Địa chỉ không tồn tại', null),
          HttpStatus.NOT_FOUND,
        );
      return new ResponseDto('success', 'Cập nhật thành công', updatedAddress);
    } catch (error) {
      throw new HttpException(
        new ResponseDto('error', 'Lỗi khi cập nhật địa chỉ', null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<ResponseDto<any>> {
    try {
      const deleted = await this.customerAddressService.delete(id);
      if (!deleted)
        throw new HttpException(
          new ResponseDto('error', 'Địa chỉ không tồn tại', null),
          HttpStatus.NOT_FOUND,
        );
      return new ResponseDto('success', 'Xóa địa chỉ thành công', id);
    } catch (error) {
      throw new HttpException(
        new ResponseDto('error', 'Lỗi khi xóa địa chỉ', null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
