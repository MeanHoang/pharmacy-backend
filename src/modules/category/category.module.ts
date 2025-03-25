import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from 'src/entities/category.entity';

import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), CloudinaryModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
