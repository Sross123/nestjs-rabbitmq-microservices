# NestJS RabbitMQ Microservices

A minimal NestJS microservice example using RabbitMQ for asynchronous communication.

This repository contains two services:

- `api-gateway`: HTTP gateway that forwards order requests to RabbitMQ.
- `order-service`: microservice scaffold configured to connect to RabbitMQ.

## Architecture

The project uses RabbitMQ as the messaging layer. The API gateway sends messages to a queue, and the order service is intended to consume those messages.

### Services

- `api-gateway`
  - NestJS application with an HTTP controller.
  - Uses `@nestjs/microservices` and RabbitMQ transport.
  - Sends commands to RabbitMQ using a client proxy.

- `order-service`
  - NestJS microservice bootstrap.
  - Configured to connect to RabbitMQ and listen on a queue.
  - Currently contains placeholder HTTP controller and service logic.

## Repository Structure

```text
nestjs-rabbitmq-microservices/
├── api-gateway/      # API gateway service
├── order-service/    # Order microservice
└── docker-compose.yml # RabbitMQ broker configuration
```

## Prerequisites

- Docker and Docker Compose
- Node.js (compatible with NestJS 11)
- pnpm (recommended for package installation)

## RabbitMQ Broker

The broker is configured in `docker-compose.yml`.

To start RabbitMQ:

```bash
docker-compose up -d
```

RabbitMQ UI should be available at:

- `http://localhost:15672`
- default credentials: `guest` / `guest`

## Install Dependencies

Install dependencies separately in each service folder.

```bash
cd api-gateway
pnpm install

cd ../order-service
pnpm install
```

## Running the Services

### Start API Gateway

```bash
cd api-gateway
pnpm run start:dev
```

The API gateway listens on `http://localhost:3000/api`.

### Start Order Service

```bash
cd order-service
pnpm run start:dev
```

The order service starts as a NestJS microservice and connects to RabbitMQ.

## API Usage

### Create an order

Send a POST request to the gateway:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items": [{"sku": "prod-123", "qty": 1}], "customerId": "user-1"}'
```

The gateway currently forwards requests to RabbitMQ using a command pattern.

## RabbitMQ Configuration

The gateway client is configured in `api-gateway/src/app.module.ts`:

- RabbitMQ URL: `amqp://guest:guest@localhost:5672`
- Queue: `order_queue`

The order service is configured in `order-service/src/main.ts`:

- RabbitMQ URL: `amqp://guest:guest@localhost:5672`
- Queue: `orders_queue`

> Note: The gateway and order service use different queue names in the current code. To enable communication, update both services to use the same queue name.

## Important Notes

- The order service currently does not include a `@MessagePattern` handler for RabbitMQ commands.
- This repository is a starting point for a NestJS + RabbitMQ microservices architecture.

## Troubleshooting

- If the gateway cannot connect to RabbitMQ, verify the Docker container is running and the ports are available.
- If the order service does not receive messages, confirm the queue names are aligned in both services.

## License

This project is provided as-is for learning and experimentation.
