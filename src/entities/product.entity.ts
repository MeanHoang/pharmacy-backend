import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  discount: number;

  @Column({ nullable: true })
  packaging: string;

  @Column({ nullable: true })
  specification: string;

  @Column({ nullable: true })
  indications: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ nullable: true })
  origin: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ type: 'text', nullable: true })
  ingredients: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ default: true })
  is_sales: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  category: Category;
}
