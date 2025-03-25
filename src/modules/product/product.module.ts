import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from 'src/entities/product.entity';

import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CloudinaryModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
