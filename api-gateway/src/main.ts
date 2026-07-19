import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  // Initialize standard NestJS logger bound to the Gateway context
  const logger = new Logger('ApiGateway');

  // Create standard HTTP application instance
  const app = await NestFactory.create(AppModule);

  // Global prefix helps with routing rules behind load balancers (e.g., Nginx)
  app.setGlobalPrefix("api")

  // Enforce strict runtime typing and validation on all routes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Strips away any properties not explicitly defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are passed
      transform: true,        // Automatically transforms incoming plain payloads into DTO instances
    }),
  );

  // Bind the new global response formatter here
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT || 3000;

  await app.listen(port);

  logger.log(`🚀 API Gateway running smoothly on: http://localhost:${port}/api`)
}
bootstrap();
