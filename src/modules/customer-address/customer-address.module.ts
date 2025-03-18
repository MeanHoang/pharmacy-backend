import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerAddress } from '../../entities/customer-address.entity';
import { CustomerAddressController } from './customer-address.controller';
import { CustomerAddressService } from './customer-address.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerAddress])],
  controllers: [CustomerAddressController],
  providers: [CustomerAddressService],
})
export class CustomerAddressModule {}
