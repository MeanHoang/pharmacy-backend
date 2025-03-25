import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Not } from 'typeorm';

import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  //find all
  async findAll(
    page: number,
    limit: number,
    search?: string,
    isSales?: boolean,
  ) {
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('product');

      // Tìm kiếm với điều kiện OR
      if (search) {
        queryBuilder.where(
          `(product.name LIKE :search OR product.description LIKE :search OR 
            product.brand LIKE :search OR product.origin LIKE :search OR 
            product.ingredients LIKE :search OR product.note LIKE :search)`,
          { search: `%${search}%` },
        );
      }

      // AND với isSales
      if (isSales !== undefined) {
        queryBuilder.andWhere('product.is_sales = :isSales', { isSales });
      }

      queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('product.updated_at', 'DESC');

      const [data, total] = await queryBuilder.getManyAndCount();

      console.log('>>> check result:', data); // Debug kết quả

      return {
        data,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      };
    } catch (error) {
      console.error('>> Error in findAll:', error);
      throw new Error(error.message);
    }
  }

  //create
  async create(productData: Partial<Product> & { category_id: number }) {
    // console.log('>>> Check productData: ', productData);

    try {
      const category = await this.categoryRepository.findOne({
        where: { id: productData.category_id },
      });

      if (!category) {
        return null;
      }

      const newProduct = this.productRepository.create({
        ...productData,
        category, // Gán entity Category, không phải ID
      });

      // Lưu product vào cơ sở dữ liệu
      return await this.productRepository.save(newProduct);
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
