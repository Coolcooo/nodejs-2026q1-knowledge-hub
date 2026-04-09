import { Module } from '@nestjs/common';
import { CategoryController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoriesService],
  imports: [ArticlesModule],
})
export class CategoriesModule {}
