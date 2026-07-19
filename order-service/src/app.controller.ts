import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger('AppController');

  constructor(private readonly appService: AppService) {}

  // The pattern must match the producer's { cmd: '...' } exactly
  @MessagePattern({ cmd: 'create_order' })
  async handleCreateOrder(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef(); // The active AMQP channel
    const originalMessage = context.getMessage(); // The underlying raw AMQP packet
    try {
      // 1. Process your core business logic
      const result = await this.appService.createOrder(data);

      // 2. SUCCESS: Explicitly acknowledge the message to remove it from the queue
      channel.ack(originalMessage);


      return result;
    } catch (error) {
      this.logger.error(`Failed to process order. Rejecting message`, error);

      // 3. FAILURE: Negative Acknowledge (NACK).
      // Params: (message, allUpTo, requeue) -> setting true puts it back in line
      channel.nack(originalMessage, false, false);
      throw error;
    }
  }

  // Event handler for fire-and-forget events
  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any) {
    this.logger.log(
      `🔔 Event received: Order #${data.orderId} was created at ${data.timestamp}`,
    );
    // No return statement here! NestJS won't send anything back to RabbitMQ.
  }
}
