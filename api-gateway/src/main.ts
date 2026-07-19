import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';

// api-gateway/src/main.ts
async function bootstrap() {
  const logger = new Logger('ApiGateway');
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new RpcExceptionFilter());
  
  // CRITICAL: Listen for termination signals (SIGTERM, SIGINT) to close connections smoothly
  app.enableShutdownHooks();
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 API Gateway running smoothly on: http://localhost:${port}/api`);
}
bootstrap();