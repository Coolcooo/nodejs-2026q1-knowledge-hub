import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpError } from './errors/http.error';
import { getReasonPhrase } from 'http-status-codes';
import { WinstonService } from '../loggers/winston/winston.service';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonService) {}
  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode: number;
    let message: string;
    if (exception instanceof HttpError) {
      statusCode = exception.getStatus();
      message = exception.getMessage();
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
    }
    const error = getReasonPhrase(statusCode);
    this.logger.error(exception);
    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
