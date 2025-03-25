import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from 'src/entities/store.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; //dung sign sinh token

import { ResponseDto } from 'src/dtos/response.dto';

@Injectable()
export class StoreAuthService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<ResponseDto<any>> {
    try {
      const store = await this.storeRepository.findOne({
        where: { username },
      });

      if (!store) {
        return new ResponseDto(
          'error',
          'Kiểm tra lại tài khoản hoặc mật khẩu',
          null,
        );
      }

      const isMatch = await bcrypt.compare(password, store.password);
      if (!isMatch) {
        return new ResponseDto(
          'error',
          'Kiểm tra lại tài khoản hoặc mật khẩu',
          null,
        );
      }

      const token = this.jwtService.sign(
        {
          id: store.id,
          username: store.username,
          role: 'store',
        },
        { secret: process.env.JWT_SECRET, expiresIn: '1d' },
      );
      return new ResponseDto('success', 'Đăng nhập thành công', { token });
    } catch (error) {
      console.error('Error during login in StoreAuthService:', error);
      throw new Error('Internal Server Error');
    }
  }
}
