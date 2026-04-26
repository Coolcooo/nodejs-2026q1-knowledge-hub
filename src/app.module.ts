import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CaslModule } from './modules/casl/casl.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpExceptionFilter } from './filters/http.exception-filter';
import { LoggingInterceptor } from './interseptors/logging.interceptor';
import { WinstonModule } from './loggers/winston/winston.module';
@Module({
  imports: [
    UsersModule,
    ArticlesModule,
    CategoriesModule,
    CommentsModule,
    AuthModule,
    CaslModule,
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 600000,
        limit: 10,
      },
    ]),
    WinstonModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
