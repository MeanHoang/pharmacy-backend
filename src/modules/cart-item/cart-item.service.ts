import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { CartItem } from 'src/entities/cart-item.entity';
import { Cart } from 'src/entities/cart.entity';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Lấy danh sách CartItem (có phân trang)
  async findAll(page: number, limit: number, cart_id?: number) {
    try {
      const whereCondition: FindOptionsWhere<CartItem> = {};

      if (cart_id) {
        whereCondition.cart = { id: cart_id }; // Lọc theo cart_id
      }

      const [data, total] = await this.cartItemRepository.findAndCount({
        where: whereCondition,
        relations: ['product'],
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
      throw new Error('Không thể lấy danh sách CartItem');
    }
  }

  // Tạo một CartItem
  async create(
    cartItemData: Partial<CartItem> & { cart_id: number; product_id: number },
  ) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { id: cartItemData.cart_id },
      });

      if (!cart) throw new Error('Chưa có giỏ hàng không tồn tại');

      const product = await this.productRepository.findOne({
        where: { id: cartItemData.product_id },
      });
      if (!product) throw new Error('Sản phẩm không tồn tại');

      console.log('>> cartItemData:', cartItemData);

      const newCartItem = this.cartItemRepository.create({
        ...cartItemData,
        cart, // Gán entity Cart thay vì chỉ ID
        product,
      });

      return await this.cartItemRepository.save(newCartItem);
    } catch (error) {
      console.error('>> Error in create:', error);
      throw new Error('Không thể tạo CartItem');
    }
  }

  // Lấy CartItem theo ID
  async getCartItemByID(id: number) {
    try {
      const cartItem = await this.cartItemRepository.findOne({
        where: { id },
        relations: ['product', 'cart'], // Load product và cart nếu cần
      });

      if (!cartItem) {
        throw new Error('CartItem không tồn tại');
      }

      return cartItem;
    } catch (error) {
      console.error('>> Error in getCartItemByID:', error);
      throw new Error('Không thể lấy CartItem');
    }
  }

  // Cập nhật CartItem
  async update(id: number, cartItemData: Partial<CartItem>) {
    try {
      const cartItem = await this.cartItemRepository.findOne({ where: { id } });

      if (!cartItem) {
        throw new Error('CartItem không tồn tại');
      }

      Object.assign(cartItem, cartItemData);
      return await this.cartItemRepository.save(cartItem);
    } catch (error) {
      console.error('>> Error in update:', error);
      throw new Error('Không thể cập nhật CartItem');
    }
  }

  //delete
  async delete(id: number) {
    const deleteResult = await this.cartItemRepository.delete(id);

    if (deleteResult.affected === 0) {
      return false;
    }

    return true;
  }
}
