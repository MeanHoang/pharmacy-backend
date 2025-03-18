import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from '../jwt.strategy';
import { PassportModule } from '@nestjs/passport';

import { CustomerAuthService } from './customer-auth.service';
import { CustomerAuthController } from './customer-auth.controller';
import { Customer } from 'src/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mysecretkey',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  controllers: [CustomerAuthController],
  providers: [CustomerAuthService, JwtStrategy],
  exports: [CustomerAuthService, JwtModule, PassportModule],
})
export class CustomerAuthModule {}
