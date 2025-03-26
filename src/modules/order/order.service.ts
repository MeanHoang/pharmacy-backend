import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { Order } from 'src/entities/order.entity';
import { Customer } from 'src/entities/customer.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  //find all
  async findAll(page: number, limit: number, customer_id?: number) {
    try {
      const whereCondition: FindOptionsWhere<Order> = {};

      if (customer_id) {
        whereCondition.customer = { id: Number(customer_id) };
      }

      // Thực hiện truy vấn với findAndCount
      const [data, total] = await this.orderRepository.findAndCount({
        where: whereCondition,
        relations: ['customer'],
        skip: (page - 1) * limit,
        take: limit,
        order: { updated_at: 'DESC' },
      });

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
  async create(orderData: Partial<Order> & { customer_id: number }) {
    try {
      const customer = await this.customerRepository.findOne({
        where: { id: orderData.customer_id },
      });

      if (!customer) {
        return null;
      }

      const newOrder = this.orderRepository.create({
        ...orderData,
        customer, // Gán entity Customer thay vì ID
      });

      return await this.orderRepository.save(newOrder);
    } catch (error) {
      console.log('>> Check error: ', error);
      throw new Error(error.message);
    }
  }

  //get order by ID
  async getOrderByID(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer'], // Load customer nếu cần
    });

    return order || null;
  }

  //update
  async update(id: number, orderData: Partial<Order>) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      return null;
    }

    Object.assign(order, orderData);

    return await this.orderRepository.save(order);
  }

  //delete
  async delete(id: number) {
    const deleteResult = await this.orderRepository.delete(id);

    if (deleteResult.affected === 0) {
      return false;
    }

    return true;
  }
}
