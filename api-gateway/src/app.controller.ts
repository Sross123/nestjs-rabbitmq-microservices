import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('orders')
export class AppController {
  // Inject the configured RabbitMQ client proxy using its unique token
  constructor(
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
  ) {}

  @Post()
  createOrder(@Body() orderData: any): Observable<any> {
    // 'send' indicates Request-Response pattern.
    // Argument 1: The command/message pattern string.
    // Argument 2: The actual data payload.
    return this.orderClient.send({ cmd: 'create_order' }, orderData);
  }
}
