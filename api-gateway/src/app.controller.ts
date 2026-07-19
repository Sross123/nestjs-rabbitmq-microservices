import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, tap } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class AppController {
  // Inject the configured RabbitMQ client proxy using its unique token
  constructor(
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  @Post()
  createOrder(@Body() orderData: CreateOrderDto): Observable<any> {
    // 1. We still use 'send' to process the synchronous core logic
    return this.orderClient.send({ cmd: 'create_order' }, orderData).pipe(
      tap((response) => {
        // Fire the background event instantly into the notifications queue basket
        this.notificationClient.emit('order_created', {
          orderId: response.orderId,
          timestamp: new Date(),
        });
      }),
    );
  }
}
