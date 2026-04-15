import { CreateArticleDto } from '../dto/create-article.dto';
import { randomUUID } from 'node:crypto';
import { Status } from '../../../generated/prisma/enums';
import { Transform } from 'class-transformer';

export class Article {
  id: string = randomUUID();
  title: string;
  content: string;
  status: Status;
  authorId: string | null; // refers to User
  categoryId: string | null; // refers to Category
  tags: string[]; // array of tag names
  @Transform(({ value }) => {
    return +value;
  })
  createdAt: Date = new Date(); // timestamp of creation
  @Transform(({ value }) => {
    return +value;
  })
  updatedAt: Date = new Date(); // timestamp of last update
  constructor(createArticleDto: CreateArticleDto) {
    Object.assign(this, createArticleDto);
  }
}
