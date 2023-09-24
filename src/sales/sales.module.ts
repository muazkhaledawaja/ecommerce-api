/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DeliveryMethodsModule } from './delivery-methods/delivery-methods.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { OrdersModule } from './orders/orders.module';
import { ReturnsModule } from './returns/returns.module';
import { QrCodeModule } from './qr-code/qr-code.module';

@Module({
  imports: [
    DeliveryMethodsModule,
    PaymentMethodsModule,
    OrdersModule,
    ReturnsModule,
    QrCodeModule,
 
  ],
  exports: [
    DeliveryMethodsModule,
    PaymentMethodsModule,
    OrdersModule,
    ReturnsModule,
    QrCodeModule,
   
  ],
})
export class SalesModule {}
