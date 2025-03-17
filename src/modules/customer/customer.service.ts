import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Customer } from 'src/entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepositoty: Repository<Customer>,
  ) {}

  //find all
  async findAll(page: number, limit: number, search?: string) {
    const whereCondition: FindOptionsWhere<Customer>[] = search
      ? [
          { email: Like(`%${search}%`) },
          { fullname: Like(`%${search}%`) },
          { phonenumber: Like(`%${search}%`) },
        ]
      : [];

    const [data, total] = await this.customerRepositoty.findAndCount({
      where: whereCondition.length > 0 ? whereCondition : undefined,
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
}
