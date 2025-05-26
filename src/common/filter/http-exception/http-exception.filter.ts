import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiException } from './api.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errResponse: any = exception.getResponse();

    if (exception instanceof ApiException) {
      return response.status(status).json({
        code: exception.getErrorCode(),
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
    }

    return response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errResponse.message[0]
        ? errResponse.message[0]
        : exception.message,
    });
  }
}
