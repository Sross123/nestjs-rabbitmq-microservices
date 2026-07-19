// notification-service/src/app.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any) {
    this.appService.sendOrderEmail(data);
  }
}