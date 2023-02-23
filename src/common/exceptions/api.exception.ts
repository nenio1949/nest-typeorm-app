import { HttpException } from '@nestjs/common';
import {
  ErrorCodeMap,
  ErrorCodeMapType,
} from '../contants/error-code.contants';

/**
 * Api业务异常均抛出该异常
 */
export class ApiException extends HttpException {
  /**
   * 业务类型错误代码，非Http code
   */
  private errorCode: ErrorCodeMapType | number;

  constructor(errorCode: ErrorCodeMapType | number, message?: string) {
    super(errorCode in ErrorCodeMap ? ErrorCodeMap[errorCode] : message, 200);
    this.errorCode = errorCode;
  }

  getErrorCode(): ErrorCodeMapType | number {
    return this.errorCode;
  }
}
