import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { HTTP_CODE_MESSAGES } from '../../contants';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class CategoriesService {
  categories: Category[] = [];
  constructor(private readonly articlesService: ArticlesService) {}
  findAll() {
    return this.categories;
  }
  findOne(id: string) {
    for (let i = this.categories.length - 1; i >= 0; i -= 1) {
      const category = this.categories[i];
      if (category.id === id) {
        return category;
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }
  create(createCategoryDto: CreateCategoryDto) {
    const category = new Category(createCategoryDto);
    this.categories.push(category);
    return category;
  }
  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    for (let i = this.categories.length - 1; i >= 0; i -= 1) {
      const category = this.categories[i];
      if (category.id === id) {
        Object.assign(category, updateCategoryDto);
        return category;
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }
  delete(id: string) {
    for (let i = this.categories.length - 1; i >= 0; i -= 1) {
      const category = this.categories[i];
      if (category.id === id) {
        this.categories.splice(i, 1);
        this.articlesService.unlinkByCategoryId(id);
        return;
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }
}
