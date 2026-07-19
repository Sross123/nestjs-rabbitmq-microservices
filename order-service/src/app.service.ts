import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationShutdown {
  private readonly logger = new Logger('OrderService');

  createOrder(data: any) {
    this.logger.log(`Processing order: ${JSON.stringify(data)}`);
    return {
      success: true,
      orderId: Math.floor(Math.random() * 1000),
      message: 'Order processed successfully',
    };
  }

  // This hook runs automatically when the application receives a shutdown signal
  onApplicationShutdown(signal: string) {
    this.logger.warn(`Received signal: ${signal}. Safely disconnecting channels and releasing resources...`);
  }
}