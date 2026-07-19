import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Initialize standard NestJS logger bound to the Gateway context
  const logger = new Logger('ApiGateway');

  // Create standard HTTP application instance
  const app = await NestFactory.create(AppModule);

  // Global prefix helps with routing rules behind load balancers (e.g., Nginx)
  app.setGlobalPrefix("api")

  const port = process.env.PORT || 3000;

  await app.listen(port);

  logger.log(`🚀 API Gateway running smoothly on: http://localhost:${port}/api`)
}
bootstrap();
