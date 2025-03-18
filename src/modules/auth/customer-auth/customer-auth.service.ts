import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; //dung sign sinh token

import { ResponseDto } from 'src/dtos/response.dto';

@Injectable()
export class CustomerAuthService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<ResponseDto<any>> {
    try {
      const customer = await this.customerRepository.findOne({
        where: { email },
      });

      if (!customer) {
        return new ResponseDto(
          'error',
          'Kiểm tra lại tài khoản hoặc mật khẩu',
          null,
        );
      }

      const isMatch = await bcrypt.compare(password, customer.password);
      if (!isMatch) {
        return new ResponseDto(
          'error',
          'Kiểm tra lại tài khoản hoặc mật khẩu',
          null,
        );
      }

      const token = this.jwtService.sign(
        {
          id: customer.id,
          email: customer.email,
          role: 'customer',
        },
        { secret: process.env.JWT_SECRET, expiresIn: '1d' },
      );
      return new ResponseDto('success', 'Đăng nhập thành công', { token });
    } catch (error) {
      console.error('Error during login in CustomerAuthService:', error);
      throw new Error('Internal Server Error');
    }
  }
}
