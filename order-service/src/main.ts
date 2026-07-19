import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('OrderService');

  // Create a NestJS Microservice instance instead of a classic HTTP Web App
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ, // Use RabbitMQ transport layer
      options: {
        // The AMQP connection URI pointing to our Docker container
        urls: ['amqp://guest:guest@localhost:5672'],

        // The specific queue this service will pull tasks from
        queue: 'orders_queue', //queue name
        // queueOptions setup ensures the queue survives a RabbitMQ crash/restart
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  logger.log('📦 Order Microservice is connected to RabbitMQ and listening...');
}

bootstrap();
