import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('OrderService');

  // Create a temporary reference application instance to inspect the IoC container
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
  

  if (!rabbitMqUrl) {
    throw new Error('RABBITMQ_URL is required');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: 'order_queue',
        // CRITICAL: Disables automatic ACK. We now control the message lifecycle manually.
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  // Close the standalone configuration context to prevent memory leaks
  await appContext.close();

  await app.listen();
  logger.log('📦 Order Microservice is configured cleanly and listening...');
}

bootstrap();
