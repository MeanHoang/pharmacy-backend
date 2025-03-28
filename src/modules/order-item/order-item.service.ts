import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Lấy danh sách OrderItem (có phân trang)
  async findAll(page: number, limit: number, order_id?: number) {
    try {
      const whereCondition: FindOptionsWhere<OrderItem> = {};

      if (order_id) {
        whereCondition.order = { id: order_id }; // Lọc theo order_id
      }

      const [data, total] = await this.orderItemRepository.findAndCount({
        where: whereCondition,
        relations: ['product', 'order'],
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
      throw new Error('Không thể lấy danh sách OrderItem');
    }
  }

  // Tạo một OrderItem
  async create(
    orderItemData: Partial<OrderItem> & {
      order_id: number;
      product_id: number;
    },
  ) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderItemData.order_id },
      });

      if (!order) throw new Error('Chưa có giỏ hàng không tồn tại');

      const product = await this.productRepository.findOne({
        where: { id: orderItemData.product_id },
      });
      if (!product) throw new Error('Sản phẩm không tồn tại');

      console.log('>> orderItemData:', orderItemData);

      const newOrderItem = this.orderItemRepository.create({
        ...orderItemData,
        order, // Gán entity Order thay vì chỉ ID
        product,
      });

      return await this.orderItemRepository.save(newOrderItem);
    } catch (error) {
      console.error('>> Error in create:', error);
      throw new Error('Không thể tạo OrderItem');
    }
  }

  // Lấy OrderItem theo ID
  async getOrderItemByID(id: number) {
    try {
      const orderItem = await this.orderItemRepository.findOne({
        where: { id },
        relations: ['product', 'order'], // Load product và order nếu cần
      });

      if (!orderItem) {
        throw new Error('OrderItem không tồn tại');
      }

      return orderItem;
    } catch (error) {
      console.error('>> Error in getOrderItemByID:', error);
      throw new Error('Không thể lấy OrderItem');
    }
  }

  // Cập nhật OrderItem
  async update(id: number, orderItemData: Partial<OrderItem>) {
    try {
      const orderItem = await this.orderItemRepository.findOne({
        where: { id },
      });

      if (!orderItem) {
        throw new Error('OrderItem không tồn tại');
      }

      Object.assign(orderItem, orderItemData);
      return await this.orderItemRepository.save(orderItem);
    } catch (error) {
      console.error('>> Error in update:', error);
      throw new Error('Không thể cập nhật OrderItem');
    }
  }

  //delete
  async delete(id: number) {
    const deleteResult = await this.orderItemRepository.delete(id);

    if (deleteResult.affected === 0) {
      return false;
    }

    return true;
  }
}
