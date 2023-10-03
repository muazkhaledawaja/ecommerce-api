/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Res, Post } from '@nestjs/common';
import { Response } from 'express';
import { QrCodeService } from './qr-code.service';
import { OrdersService } from '../orders/orders.service';
import * as PDFDocument from 'pdfkit'; 
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/models/role.enum';
import { Order } from '../orders/models/order.entity';
 

@Controller('qr-code')
export class QrCodeController {
  constructor(
    private readonly qrCodeService: QrCodeService,
    private readonly ordersService: OrdersService,
  ) { }

  @Get(':orderId/pdf')  
  @Roles(Role.Admin)
  @ApiOkResponse({
    type: Order,
    description: 'generating QR code for Oreder with given id',
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in' })
  @ApiForbiddenResponse({ description: 'User not authorized' })
  async generateQrCodePDF(@Param('orderId') orderId: number, @Res() res: Response) {
    try {
      const order = await this.ordersService.getOrder(orderId);
      if (!order) {
        res.status(404).send('Order not found');
        return;
      }
      const qrCodeImage = await this.qrCodeService.generateQrCode(order);

      // Create a PDF document
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=order_${order.id}.pdf`);
      pdfDoc.pipe(res);

      // Add content to the PDF
      pdfDoc.text(`QR Code for Order ${order.id} `, 50, 50);
 
      pdfDoc.image(qrCodeImage, 50, 80, { width: 200 });

      // Finalize the PDF and send it to the response
      pdfDoc.end();
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }


  @Get(':orderId/jpeg')
  @Roles(Role.Admin)
  @ApiOkResponse({
    type: Order,
    description: 'generating QR code for Oreder with given id',
  })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiUnauthorizedResponse({ description: 'User not logged in' })
  @ApiForbiddenResponse({ description: 'User not authorized' })
  async getQrCode(@Param('orderId') orderId: number, @Res() res: Response) {
    const order = await this.ordersService.getOrder(orderId);
    if (!order) {
      res.status(404).send('Order not found');
      return;
    }
    const qrCodeData = `OrderID: ${orderId}`;
    try {
      const imageBuffer = await this.qrCodeService.generateQrCodeImage(qrCodeData);
      res.contentType('image/png');
      res.send(imageBuffer);
    } catch (error) {
      res.status(500).send('Error generating QR code');
    }
  }

  @Post('scan')
  @Roles(Role.Admin, Role.Delivery)
  async scanQrCode(@Body() { imageBase64 }: { imageBase64: string }) {
    try {
      const qrCodeData = await this.qrCodeService.scanQrCode(imageBase64);
    // Extract the order ID from the scanned QR code data;
      const orderId = qrCodeData.split('OrderID: ')[1];
      await this.ordersService.markOrderAsDelivered(parseInt(orderId));
      return { qrCodeData };
    } catch (error) {
      return { error: 'Failed to scan QR code' };
    }
  }


}
