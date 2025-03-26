import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { OrderStatus } from './order-status.entity';
import { PaymentMethod } from './payment-method.entity';
import { PaymentStatus } from './payment-status.entity';

import { Customer } from './customer.entity';
import { OrderItem } from './order-item.entity';
import { Transaction } from './transaction.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Many To One table Customer
  @ManyToOne(() => Customer, (customer) => customer.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'int', nullable: false })
  total_price: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  payment_status: PaymentStatus;

  @Column({ type: 'varchar', length: 255 })
  recipient_name: string;

  @Column({ type: 'varchar', length: 15 })
  phone_number: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  district: string;

  @Column({ type: 'varchar', length: 100 })
  ward: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Quan hệ OneToMany với OrderItem
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  // Quan hệ OneToMany với Transaction
  @OneToMany(() => Transaction, (transaction) => transaction.order, {
    cascade: true,
  })
  transactions: Transaction[];
}
