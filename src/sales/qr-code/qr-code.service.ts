/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */


import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { Order } from '../orders/models/order.entity';
const QrCode = require('qrcode-reader');
const Jimp = require('jimp');
const sharp = require('sharp');

@Injectable()
export class QrCodeService {
  async generateQrCode(order: Order): Promise<string> {
    const qrCodeData = `OrderID: ${order.id} Full Name: ${order.fullName} Contact Email: ${order.contactEmail} Contact Phone: ${order.contactPhone} Message: ${order.message}`
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    return qrCodeImage;
  }


  async  generateQrCodeImage(data: string): Promise<Buffer> {

    const qrCodeBuffer = await QRCode.toBuffer(data);
    const imageBuffer = await sharp(qrCodeBuffer).toBuffer();
    return imageBuffer;
  }

  async scanQrCode(imageBase64: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const qr = new QrCode();

      const newQrCode = imageBase64.substring('data:image/png;base64,'.length)

      const buffer = Buffer.from(newQrCode, 'base64');

      Jimp.read(buffer, (err: any, image: { bitmap: any; }) => {
        if (err) {
          reject(err);
          return;
        }

        qr.callback = (err: any, value: { result: string | PromiseLike<string>; }) => {
          if (err) {
            reject(err);
          } else {
            resolve(value.result);
          }
        };
        qr.decode(image.bitmap);
      });
    });
  }


}