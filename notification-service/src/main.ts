// notification-service/src/main.ts
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('NotificationService');

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
        queue: 'notifications_queue', // Its own independent queue basket
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await appContext.close();
  await app.listen();
  logger.log('🔔 Notification Worker is connected to RabbitMQ and listening...');
}

bootstrap();