import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

export class CreatePaymentDto {
  orderId: number;
}

export class ConfirmPaymentDto {
  orderId: number;
  transactionId: string;
}

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto.orderId);
  }

  @Post('confirm')
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    return this.paymentService.confirmPayment(
      confirmPaymentDto.orderId,
      confirmPaymentDto.transactionId,
    );
  }
}
