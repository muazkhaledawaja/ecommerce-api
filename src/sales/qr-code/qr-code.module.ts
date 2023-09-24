/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { QrCodeController } from './qr-code.controller';
import { OrdersModule } from '../orders/orders.module';
 


@Module({
imports: [OrdersModule],
providers: [QrCodeService],
controllers: [QrCodeController],
})
export class QrCodeModule {}

