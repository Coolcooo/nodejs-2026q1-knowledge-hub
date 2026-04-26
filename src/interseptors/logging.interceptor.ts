import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';
import { WinstonService } from '../loggers/winston/winston.service';

const sensitiveFields = ['password', 'refreshToken', 'accessToken'];
function redact(value: unknown, key?: string) {
  let resultObj = null;
  if (Array.isArray(value)) {
    resultObj = [];
    for (let i = 0; i < value.length; i += 1) {
      resultObj.push(redact(value[i]));
    }
    return resultObj;
  } else if (value instanceof Object) {
    resultObj = {};
    for (const key in value) {
      resultObj[key] = redact(value[key], key);
    }
    return resultObj;
  } else if (key && sensitiveFields.includes(key.toLowerCase())) {
    return '[REDACTED]';
  } else {
    return value;
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url, params, body } = request;
    this.logger.log({
      method,
      url,
      params,
      body: redact(body),
    });
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => {
        this.logger.log({
          responseTime: Date.now() - startTime,
          statusCode: response.statusCode,
        });
      }),
    );
  }
}
