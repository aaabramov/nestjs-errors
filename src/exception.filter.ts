import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException, ErrorDomain } from './business.exception';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

export interface ApiError {
  id: string;
  domain: ErrorDomain;
  message: string;
  timestamp: Date;
}

@Catch(Error)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  constructor(
    @InjectMetric('nestjs_errors') private readonly counter: Counter<string>,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    let error: BusinessException;
    let status: HttpStatus;

    if (exception instanceof BusinessException) {
      // Straightforward handling of our own exceptions
      error = exception;
      status = exception.status;
    } else if (exception instanceof HttpException) {
      // We can extract internal message & status from NestJS errors
      // Useful with class-validator
      error = new BusinessException(
        ErrorDomain.Generic,
        exception.message,
        exception.message,
        exception.getStatus(),
      );
      status = exception.getStatus();
    } else {
      // For all other exception simply return 500 error
      error = new BusinessException(
        ErrorDomain.Generic,
        `Internal error occurred: ${exception.message}`,
        'Internal error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    this.counter.labels(error.domain, error.status.toString()).inc();

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Logs will contain error identifier as well as
    // request path where is occurred
    this.logger.error(
      `Got an exception: ${JSON.stringify({
        path: request.url,
        ...error,
      })}`,
    );

    console.log(HttpStatus[status]);

    response.status(status).json(error.toApiError());
  }
}
