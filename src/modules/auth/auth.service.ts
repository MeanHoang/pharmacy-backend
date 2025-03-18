// src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/admin.entity';
import { Customer } from 'src/entities/customer.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResponseDto } from 'src/dtos/response.dto';
import { LoginAdminDto } from 'src/dtos/login-admin.dto';
import { LoginCustomerDto } from 'src/dtos/login-customer.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly jwtService: JwtService,
  ) {}

  // Đăng nhập Admin
  async loginAdmin(
    username: string,
    password: string,
  ): Promise<ResponseDto<any>> {
    try {
      const admin = await this.adminRepository.findOne({ where: { username } });

      if (!admin) {
        return new ResponseDto(
          'error',
          'Kiểm tra lại tài khoản hoặc mật khẩu',
          null,
        );
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return new ResponseDto(
          'error',
          'Kiểm tra lại tài khoản hoặc mật khẩu',
          null,
        );
      }

      const token = this.jwtService.sign(
        {
          id: admin.id,
          username: admin.username,
          role: 'admin',
        },
        { secret: process.env.JWT_SECRET, expiresIn: '1d' },
      );
      return new ResponseDto('success', 'Đăng nhập thành công', { token });
    } catch (error) {
      console.error('Error during login in AdminAuthService:', error);
      throw new Error('Internal Server Error');
    }
  }

  // Đăng nhập Customer
  async loginCustomer(
    email: string,
    password: string,
  ): Promise<ResponseDto<any>> {
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
