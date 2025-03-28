import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';

import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Product } from 'src/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem, Order, Product]),
    CloudinaryModule,
  ],
  providers: [OrderItemService],
  controllers: [OrderItemController],
  exports: [OrderItemService],
})
export class OrderItemModule {}
