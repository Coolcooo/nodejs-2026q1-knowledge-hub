import { Module } from '@nestjs/common';
import { WinstonService } from './winston.service';
import { winstonLogger } from '../winston.logger';

@Module({
  providers: [
    {
      provide: WinstonService,
      useFactory: () => new WinstonService(winstonLogger),
    },
  ],
  exports: [WinstonService],
})
export class WinstonModule {}
