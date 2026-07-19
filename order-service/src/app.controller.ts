import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // The pattern must match the producer's { cmd: '...' } exactly
  @MessagePattern({ cmd: 'create_order' })
  handleCreateOrder(@Payload() data: any) {
    return this.appService.createOrder(data);
  }
}
