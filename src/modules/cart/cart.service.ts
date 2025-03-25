import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { Cart } from 'src/entities/cart.entity';
import { Customer } from 'src/entities/customer.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  //find all
  async findAll(page: number, limit: number, customer_id?: number) {
    try {
      const whereCondition: FindOptionsWhere<Cart> = {};

      if (customer_id) {
        whereCondition.customer = { id: customer_id }; // Sửa lại
      }

      // Thực hiện truy vấn với findAndCount
      const [data, total] = await this.cartRepository.findAndCount({
        where: whereCondition,
        relations: ['items', 'items.product'],
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
  async create(cartData: Partial<Cart> & { customer_id: number }) {
    try {
      const customer = await this.customerRepository.findOne({
        where: { id: cartData.customer_id },
      });

      if (!customer) {
        return null;
      }

      const newCart = this.cartRepository.create({
        ...cartData,
        customer, // Gán entity Customer thay vì ID
      });

      return await this.cartRepository.save(newCart);
    } catch (error) {
      console.log('>> Check error: ', error);
      throw new Error(error.message);
    }
  }

  //get cart by ID
  async getCartByID(id: number) {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['customer'], // Load customer nếu cần
    });

    return cart || null;
  }

  //   //update
  //   async update(id: number, cartData: Partial<Cart>) {
  //     const cart = await this.cartRepository.findOne({ where: { id } });

  //     if (!cart) {
  //       return null;
  //     }

  //     Object.assign(cart, cartData);

  //     return await this.cartRepository.save(cart);
  //   }

  //delete
  async delete(id: number) {
    const deleteResult = await this.cartRepository.delete(id);

    if (deleteResult.affected === 0) {
      return false;
    }

    return true;
  }
}
