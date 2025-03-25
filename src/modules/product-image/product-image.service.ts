import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Not } from 'typeorm';

import { ProductImage } from 'src/entities/product-image.entity';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepositoty: Repository<ProductImage>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  //find all
  async findAll(page: number, limit: number) {
    const [data, total] = await this.productImageRepositoty.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    };
  }

  //create
  async create(productImage: ProductImage, image?: Express.Multer.File) {
    try {
      //Chuyển productImage từ object có null prototype thành object thường
      productImage = JSON.parse(JSON.stringify(productImage));
      // console.log('>>>check productImage in service: ', productImage);

      let imageUrl = process.env.IMG_DEAFAUL;

      if (image) {
        try {
          const uploadResult = await this.cloudinaryService.uploadImage(image);
          imageUrl = uploadResult.secure_url;
        } catch (error) {
          console.error('Lỗi upload ảnh:', error);
        }
      }

      const newProductImage = this.productImageRepositoty.create({
        ...productImage,
        image: imageUrl,
      });

      // Lưu productImage vào cơ sở dữ liệu
      const savedProductImage =
        await this.productImageRepositoty.save(newProductImage);

      return savedProductImage;
    } catch (error) {
      console.log('>>check err: ', error);
    }
  }

  //get productImage byID
  async getProductImageByID(id: number) {
    const productImage = await this.productImageRepositoty.findOneBy({ id });

    if (!productImage) {
      return null;
    }

    return productImage;
  }

  //update
  async update(id: number, productImageData: Partial<ProductImage>) {
    const productImage = await this.productImageRepositoty.findOneBy({ id });

    if (!productImage) {
      return null;
    }

    // Cập nhật từng trường nếu được gửi lên
    Object.assign(productImage, productImageData);

    return await this.productImageRepositoty.save(productImage);
  }

  //delete
  async delete(id: number) {
    const deleteResult = await this.productImageRepositoty.delete(id);

    if (deleteResult.affected === 0) {
      return false;
    }

    return true;
  }
}
