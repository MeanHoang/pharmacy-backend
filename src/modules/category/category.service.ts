import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Not } from 'typeorm';

import { Category } from 'src/entities/category.entity';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CategoryService {
  constructor(
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
    const whereCondition: FindOptionsWhere<Category>[] = [];

    // console.log('>>> Client Query:', { search, isSales });

    if (search) {
      whereCondition.push({ name: Like(`%${search}%`) });
    }

    if (isSales !== undefined) {
      whereCondition.push({ is_sales: isSales });
    }

    const [data, total] = await this.categoryRepository.findAndCount({
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

  //create
  async create(categoryData: Partial<Category>) {
    try {
      //Chuyển category từ object có null prototype thành object thường
      categoryData = JSON.parse(JSON.stringify(categoryData));
      // console.log('>>>check category in service: ', category);

      // Lưu category vào cơ sở dữ liệu
      const savedCategory = await this.categoryRepository.save(categoryData);

      return savedCategory;
    } catch (error) {
      console.log('>>check err: ', error);
    }
  }

  //get category byID
  async getCategoryByID(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      return null;
    }

    return category;
  }

  //update
  async update(id: number, categoryData: Partial<Category>) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      return null;
    }

    // Cập nhật từng trường nếu được gửi lên
    Object.assign(category, categoryData);

    return await this.categoryRepository.save(category);
  }

  //delete
  async delete(id: number) {
    const deleteResult = await this.categoryRepository.delete(id);

    if (deleteResult.affected === 0) {
      return false;
    }

    return true;
  }
}
