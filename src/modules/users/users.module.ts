import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ArticlesModule } from '../articles/articles.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [ArticlesModule, CommentsModule],
})
export class UsersModule {}
