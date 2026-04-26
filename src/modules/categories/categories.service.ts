import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { HTTP_CODE_MESSAGES } from '../../contants';
import { PrismaService } from '../../external/prisma.service';
import { plainToInstance } from 'class-transformer';
import { NotFoundError } from '../../filters/errors/http.error';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    const categories = await this.prisma.category.findMany();
    return categories.map((e) => plainToInstance(Category, e));
  }
  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundError(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
    }
    return plainToInstance(Category, category);
  }
  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category(createCategoryDto);
    await this.prisma.category.create({
      data: category,
    });
    return category;
  }
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
      return plainToInstance(Category, updatedCategory);
    } catch (e) {
      throw new NotFoundError(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
    }
  }
  async delete(id: string) {
    try {
      await this.prisma.category.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundError(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
    }
  }
}
