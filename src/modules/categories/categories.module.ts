import { Module } from '@nestjs/common';
import { CategoryController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../external/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
