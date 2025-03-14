import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Admin } from '../../../entities/admin.entity';
import * as bcrypt from 'bcrypt';
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
        return new ResponseDto('error', 'Kiểm tra lại tài khoản hoặc mật khẩu', null);
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return new ResponseDto('error', 'Kiểm tra lại tài khoản hoặc mật khẩu', null);
      }

      const token = this.jwtService.sign({ id: admin.id, role: 'admin' });
      return new ResponseDto('success', 'Đăng nhập thành công', { token });
    } catch (error) {
      console.error('Error during login in AdminAuthService:', error);
      throw new Error('Internal Server Error');
    }
  }
}
