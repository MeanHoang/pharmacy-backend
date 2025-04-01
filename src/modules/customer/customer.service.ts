import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Customer } from 'src/entities/customer.entity';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepositoty: Repository<Customer>,
    private readonly cloudinaryService: CloudinaryService,
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
  async create(customer: Customer, avatar?: Express.Multer.File) {
    try {
      //Chuyển customer từ object có null prototype thành object thường
      customer = JSON.parse(JSON.stringify(customer));
      // console.log('>>>check customer in service: ', customer);

      // Kiểm tra nếu email đã tồn tại
      const existingCustomer = await this.customerRepositoty.findOne({
        where: [
          { email: customer.email },
          { phonenumber: customer.phonenumber },
        ],
      });

      if (existingCustomer) return null;

      // Mã hóa mật khẩu trước khi lưu
      const hashedPassword = await bcrypt.hash(customer.password, 10);
      customer.password = hashedPassword;
      let avatarUrl = process.env.URL_AVATAR_DEFAULT;

      if (avatar) {
        try {
          const uploadResult = await this.cloudinaryService.uploadImage(avatar);
          avatarUrl = uploadResult.secure_url;
        } catch (error) {
          console.error('Lỗi upload ảnh:', error);
        }
      }

      const newCustomer = this.customerRepositoty.create({
        ...customer,
        password: hashedPassword,
        avatar: avatarUrl,
      });

      // Lưu customer vào cơ sở dữ liệu
      const savedCustomer = await this.customerRepositoty.save(newCustomer);

      return savedCustomer;
    } catch (error) {
      console.log('>>check err: ', error);
    }
  }

  //get customer byID
  async getCustomerByID(id: number) {
    const customer = await this.customerRepositoty.findOne({
      where: { id },
      relations: ['orders', 'addresses'],
    });
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

  //reset password
  async resetPassword(id: number) {
    const customer = await this.customerRepositoty.findOneBy({ id });

    if (!customer) {
      return null;
    }

    const defaultPassword = process.env.DEFAULT_PASS_CUSTOMER || '1';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    customer.password = hashedPassword;

    return await this.customerRepositoty.save(customer);
  }

  async updateStatus(id: number): Promise<Customer | null> {
    const customer = await this.customerRepositoty.findOne({ where: { id } });

    if (!customer) return null;

    customer.is_active = !customer.is_active; // Đảo ngược trạng thái
    return await this.customerRepositoty.save(customer);
  }
}
