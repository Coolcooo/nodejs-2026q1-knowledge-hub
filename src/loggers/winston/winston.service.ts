import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class WinstonService implements LoggerService {
  private readonly logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
  }

  log(message: any) {
    this.logger.info({ message });
  }

  error(message: any, trace?: string) {
    this.logger.error({ message, trace });
  }

  warn(message: any) {
    this.logger.warn({ message });
  }

  debug(message: any) {
    this.logger.debug({ message });
  }

  verbose(message: any) {
    this.logger.verbose({ message });
  }
}
