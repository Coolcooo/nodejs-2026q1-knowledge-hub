import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './loggers/winston.logger';
import { WinstonService } from './loggers/winston/winston.service';

async function bootstrap() {
  const loggerInstance = winstonLogger;
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonService(loggerInstance),
  });
  process.on('uncaughtException', async () => {
    loggerInstance.error('uncaughtException in process');
    if (app) {
      await app.close();
    }
    process.exit(1);
  });

  process.on('unhandledRejection', async () => {
    loggerInstance.error('unhandledRejection in process');
    if (app) {
      await app.close();
    }
    process.exit(1);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(4000);
}
bootstrap();
