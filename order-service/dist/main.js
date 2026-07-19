"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('OrderService');
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: ['amqp://guest:guest@localhost:5672'],
            queue: 'order_queue',
            queueOptions: {
                durable: true,
            },
        },
    });
    await app.listen();
    logger.log('📦 Order Microservice is connected to RabbitMQ and listening...');
}
bootstrap();
//# sourceMappingURL=main.js.map