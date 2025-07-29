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

    console.log('有问题了');

    if (exception instanceof ApiException) {
      return response.status(status).json({
        code: exception.getErrorCode(),
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
    }

    console.log('errResponse6666', errResponse);

    return response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof errResponse === 'string'
          ? errResponse
          : (errResponse?.message && Array.isArray(errResponse.message)
              ? errResponse.message[0]
              : errResponse.message) ||
            exception.message ||
            'Internal Server Error',
      // message: errResponse?.message[0]
      //   ? errResponse?.message[0]
      //   : exception?.message
      //     ? exception?.message
      //     : errResponse,
    });
  }
}
