import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger('AppController');

  constructor(private readonly appService: AppService) {}

  // The pattern must match the producer's { cmd: '...' } exactly
  @MessagePattern({ cmd: 'create_order' })
  handleCreateOrder(@Payload() data: any) {
    return this.appService.createOrder(data);
  }

  // Event handler for fire-and-forget events
  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any){
    this.logger.log(`🔔 Event received: Order #${data.orderId} was created at ${data.timestamp}`);
    // No return statement here! NestJS won't send anything back to RabbitMQ.
  }
}
