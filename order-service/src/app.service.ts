import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger("OrderService");

  createOrder(data: any){
    this.logger.log(`Processing order: ${JSON.stringify(data)}`)

    // In a real app, this is where you'd inject Prisma to save to DB
    return {
      success: true,
      orderId: Math.floor(Math.random()*1000), //mock ID
      message: "Order proccess successfully"
    }
  }
}
