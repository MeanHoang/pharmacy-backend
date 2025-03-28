import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Order } from 'src/entities/order.entity';
import { Transaction } from 'src/entities/transaction.entity';
import Stripe from 'stripe';
import { TransactionStatus } from 'src/entities/transaction-status.entity';
import { PaymentStatus } from 'src/entities/payment-status.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {
    const stripeSecretKey =
      configService.get<string>('STRIPE_SECRET_KEY') ?? '';
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createPayment(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['orderItems'],
    });

    if (!order) throw new Error('Order not found');

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const lineItems = order.orderItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Sản phẩm #` + item.id,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    console.log('>>> check line Items: ', lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: 'http://localhost:3333/success',
      cancel_url: 'http://localhost:3333/cancel',
    });

    // Lưu transaction vào database
    const transaction = this.transactionRepo.create({
      order: { id: order.id },
      transaction_id: session.id,
      payment_method: 'paypal',
      amount: order.total_price,
      status: TransactionStatus.PENDING,
    });
    await this.transactionRepo.save(transaction);

    return { url: session.url };
  }

  async confirmPayment(orderId: number, transactionId: string) {
    await this.transactionRepo.update(
      { transaction_id: transactionId },
      { status: TransactionStatus.SUCCESS },
    );
    await this.orderRepo.update(orderId, {
      payment_status: PaymentStatus.SUCCESS,
    });

    return { message: 'Thanh toán thành công!' };
  }
}
