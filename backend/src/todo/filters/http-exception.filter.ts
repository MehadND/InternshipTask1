import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';

@Catch(HttpException, ThrottlerException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (
      status === HttpStatus.TOO_MANY_REQUESTS &&
      request.originalUrl === '/api/todo/generatedescription'
    ) {
      response.status(status).json({
        statusCode: status,
        message: 'Over using the Generative AI API endpoint',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message || null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
