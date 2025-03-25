import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from 'src/entities/customer.entity';

import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CloudinaryModule],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
