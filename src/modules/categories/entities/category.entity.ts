import { TCategory } from '../../../types';
import { randomUUID } from 'crypto';
import { CreateCategoryDto } from '../dto/create-category.dto';

export class Category implements TCategory {
  id: string = randomUUID(); // uuid v4
  name: string;
  description: string;
  constructor(createCategoryDto: CreateCategoryDto) {
    Object.assign(this, createCategoryDto);
  }
}
