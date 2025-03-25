import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from '../jwt.strategy';
import { PassportModule } from '@nestjs/passport';

import { StoreAuthService } from './store-auth.service';
import { StoreAuthController } from './store-auth.controller';
import { Store } from '../../../entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mysecretkey',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  controllers: [StoreAuthController],
  providers: [StoreAuthService, JwtStrategy],
  exports: [StoreAuthService, JwtModule, PassportModule],
})
export class StoreAuthModule {}
