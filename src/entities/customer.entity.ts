import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  OneToMany,
} from 'typeorm';

import { Gender } from './gender.entity';
import { CustomerAddress } from './customer-address.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  phonenumber: string;

  @Column()
  fullname: string;

  @Column({ unique: true })
  google_id: string;

  @Column({ default: process.env.URL_AVATAR_DEFAULT })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ type: 'timestamp' })
  birthday: Date;

  @Column({ default: false })
  is_verified: Boolean;

  @Column({ default: true })
  is_active: Boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // OneToMany table address
  @OneToMany(() => CustomerAddress, (address) => address.customer, {
    cascade: true,
  })
  addresses: CustomerAddress[];

  //OneToMany table cart
  @OneToOne(() => Cart, (cart) => cart.customer)
  cart: Cart;

  //OneToMany table Order
  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
