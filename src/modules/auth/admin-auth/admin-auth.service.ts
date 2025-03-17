import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt'; //dung sign sinh token
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Admin } from '../../../entities/admin.entity';
import { ResponseDto } from '../../../dtos/response.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<ResponseDto<any>> {
    try {
      const admin = await this.adminRepo.findOne({ where: { username } });

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
}
