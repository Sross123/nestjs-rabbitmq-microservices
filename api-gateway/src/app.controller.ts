import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, tap } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class AppController {
  // Inject the configured RabbitMQ client proxy using its unique token
  constructor(@Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy) {}

  @Post()
  createOrder(@Body() orderData: CreateOrderDto): Observable<any> {
    // 1. We still use 'send' to process the synchronous core logic
    return this.orderClient.send({ cmd: 'create_order' }, orderData).pipe(
      tap((response) => {
        // 2. Once the core logic succeeds, we trigger a fire-and-forget event
        // Notice we use 'emit' instead of 'send'
        this.orderClient.emit('order_created', {
          orderId: response.orderId,
          timestamp: new Date(),
        });
      }),
    );
  }
}
