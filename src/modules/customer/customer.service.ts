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

  //create
  async create(customer: Customer) {
    // Kiểm tra nếu email đã tồn tại
    const existingCustomer = await this.customerRepositoty.findOne({
      where: [{ email: customer.email }, { phonenumber: customer.phonenumber }],
    });

    if (existingCustomer) {
      return null;
    }

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(customer.password, 10);
    customer.password = hashedPassword;

    // Lưu customer vào cơ sở dữ liệu
    const savedCustomer = await this.customerRepositoty.save(customer);

    return savedCustomer;
  }

  //get customer byID
  async getCustomerByID(id: number) {
    const customer = await this.customerRepositoty.findOneBy({ id });

    if (!customer) {
      return null;
    }

    return customer;
  }

  //update
  async update(id: number, customerData: Partial<Customer>) {
    const customer = await this.customerRepositoty.findOneBy({ id });

    if (!customer) {
      return null;
    }

    if (customerData.password) {
      const isSamePassword = await bcrypt.compare(
        customerData.password,
        customer.password,
      );
      if (!isSamePassword) {
        customerData.password = await bcrypt.hash(customerData.password, 10);
      } else {
        delete customerData.password;
      }
    }

    // Cập nhật từng trường nếu được gửi lên
    Object.assign(customer, customerData);

    return await this.customerRepositoty.save(customer);
  }

  //delete
  async delete(id: number) {
    const deleteResult = await this.customerRepositoty.delete(id);

    if (deleteResult.affected === 0) {
      return false;
    }

    return true;
  }
}
