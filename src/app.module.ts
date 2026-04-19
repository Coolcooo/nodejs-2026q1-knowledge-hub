import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CaslModule } from './modules/casl/casl.module';
import { ThrottlerModule } from '@nestjs/throttler';
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
        ttl: 0,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
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
