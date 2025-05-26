import { ApiErrorCode } from '@/common/enums/api-error-code.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  private errorMessage: string;
  private errorCode: ApiErrorCode;

  constructor(
    errorMessage: string,
    errorCode: ApiErrorCode,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(errorMessage, statusCode);
    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
  }

  getErrorCode(): ApiErrorCode {
    return this.errorCode;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}
