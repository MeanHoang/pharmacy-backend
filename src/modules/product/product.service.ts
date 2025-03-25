import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Not } from 'typeorm';

import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  //find all
  async findAll(
    page: number,
    limit: number,
    search?: string,
    isSales?: boolean,
  ) {
    const whereCondition: FindOptionsWhere<Product>[] = [];

    if (search) {
      whereCondition.push(
        { name: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
        { brand: Like(`%${search}%`) },
        { origin: Like(`%${search}%`) },
        { ingredients: Like(`%${search}%`) }, //Thành phần thuốc
        { note: Like(`%${search}%`) },
      );

      if (isSales !== undefined) {
        whereCondition.push({ is_sales: isSales });
      }

      const [data, total] = await this.productRepository.findAndCount({
        where: whereCondition.length > 0 ? whereCondition : undefined,
        skip: (page - 1) * limit,
        take: limit,
        order: { updated_at: 'DESC' }, // Sắp xếp theo ngày cập nhật mới nhất
      });

      return {
        data,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      };
    }
  }

  //create
  async create(productData: Partial<Product>) {
    try {
      //Chuyển product từ object có null prototype thành object thường
      productData = JSON.parse(JSON.stringify(productData));
      // console.log('>>>check product in service: ', product);

      // Lưu product vào cơ sở dữ liệu
      const savedProduct = await this.productRepository.save(productData);

      return savedProduct;
    } catch (error) {
      console.log('>>check err: ', error);
    }
  }

  //get product byID
  async getProductByID(id: number) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      return null;
    }

    return product;
  }

  //update
  async update(id: number, productData: Partial<Product>) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      return null;
    }

    // Cập nhật từng trường nếu được gửi lên
    Object.assign(product, productData);

    return await this.productRepository.save(product);
  }

  //delete
  async delete(id: number) {
    const deleteResult = await this.productRepository.delete(id);

    if (deleteResult.affected === 0) {
      return false;
    }

    return true;
  }
}
