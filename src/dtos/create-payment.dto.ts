import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionStatus } from '../entities/transaction-status.entity';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsEnum(['momo', 'vnpay', 'paypal'])
  payment_method: string;

  @IsNumber()
  amount: number;

  @IsUUID()
  orderId: string;
}
