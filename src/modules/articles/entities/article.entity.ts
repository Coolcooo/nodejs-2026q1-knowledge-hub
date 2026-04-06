import { TArticle, TArcticleStatus } from 'src/types';
import { CreateArticleDto } from '../dto/create-article.dto';
import { randomUUID } from 'node:crypto';

export class Article implements TArticle {
  id: string = randomUUID();
  title: string;
  content: string;
  status: TArcticleStatus;
  authorId: string | null; // refers to User
  categoryId: string | null; // refers to Category
  tags: string[]; // array of tag names
  createdAt: number = +new Date(); // timestamp of creation
  updatedAt: number = +new Date(); // timestamp of last update
  constructor(createArticleDto: CreateArticleDto) {
    Object.assign(this, createArticleDto);
  }
}
