import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Registering the microservice client within the NestJS IoC Container
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE', // The injection token used in our controllers
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'order_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
