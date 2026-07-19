// api-gateway/src/filters/rpc-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 1. Extract error details from the exception object
    const errorMessage = exception.message || 'Internal server error occurred';
    
    // 2. Map certain text messages to proper HTTP status codes
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (errorMessage.includes('not found') || errorMessage.includes('invalid')) {
      status = HttpStatus.BAD_REQUEST;
    }

    // 3. Send a clean, structured JSON error response back to the client
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: errorMessage,
    });
  }
}