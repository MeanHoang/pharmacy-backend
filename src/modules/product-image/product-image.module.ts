import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { ProductImage } from 'src/entities/product-image.entity';

import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage]), CloudinaryModule],
  providers: [ProductImageService],
  controllers: [ProductImageController],
})
export class ProductImageModule {}
