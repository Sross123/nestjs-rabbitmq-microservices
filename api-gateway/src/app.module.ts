import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    // 1. Initialize global environment configuration and runtime schema validation
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        RABBITMQ_URL: Joi.string().required(),
      }),
    }),

    // 2. Register Client Proxy dynamically using factory injection
    ClientsModule.registerAsync([
      {
        name: 'ORDER_SERVICE', // The injection token used in our controllers
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const rabbitUrl = configService.get<string>('RABBITMQ_URL');

          if (!rabbitUrl) {
            throw new Error('RABBITMQ_URL is required');
          }

          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitUrl],
              queue: 'order_queue',
              queueOptions: {
                durable: true,
              },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const rabbitUrl = configService.get<string>('RABBITMQ_URL');

          if (!rabbitUrl) {
            throw new Error('RABBITMQ_URL is required');
          }

          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitUrl],
              queue: 'notifications_queue', // Direct communication channel
              queueOptions: { durable: true },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
