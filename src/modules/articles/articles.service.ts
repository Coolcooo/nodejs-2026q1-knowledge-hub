import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { HTTP_CODE_MESSAGES } from 'src/contants';
import { GetArticleDto } from './dto/get-article.dto';
import { PrismaService } from '../../external/prisma.service';
import {
  ArticleGetPayload,
  ArticleUncheckedCreateInput,
  ArticleUncheckedUpdateInput,
  ArticleWhereInput,
} from '../../generated/prisma/models/Article';
import { randomUUID } from 'node:crypto';
import { NotFoundError } from '../../filters/errors/http.error';

const plainToArticle = (
  updated: ArticleGetPayload<{ include: { tags: true } }>,
) => {
  const updatedArticle = new Article({
    title: updated.title,
    content: updated.content,
    status: updated.status,
    authorId: updated.authorId,
    categoryId: updated.categoryId,
    tags: updated.tags.map((e) => e.name),
  });
  updatedArticle.id = updated.id;
  updatedArticle.createdAt = updated.createdAt;
  updatedArticle.updatedAt = updated.updatedAt;
  return updatedArticle;
};

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(getArticleDto: GetArticleDto) {
    const where: ArticleWhereInput = {};
    if (typeof getArticleDto.status === 'string') {
      where.status = getArticleDto.status;
    }
    if (typeof getArticleDto.categoryId === 'string') {
      where.categoryId = getArticleDto.categoryId;
    }
    if (typeof getArticleDto.tag === 'string') {
      where.tags = { some: { name: getArticleDto.tag } };
    }
    const articles = await this.prisma.article.findMany({
      where: where,
      include: { tags: true },
    });
    return articles.map(plainToArticle);
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!article) {
      throw new NotFoundError(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
    }
    return plainToArticle(article);
  }

  async create(createArticleDto: CreateArticleDto) {
    const createObj: ArticleUncheckedCreateInput = {
      ...createArticleDto,
      id: randomUUID(),
      tags: {
        connectOrCreate: createArticleDto.tags.map((tag) => {
          return {
            create: {
              name: tag,
              id: randomUUID(),
            },
            where: {
              name: tag,
            },
          };
        }),
      },
    };
    const createdArticle = await this.prisma.article.create({
      data: createObj,
      include: {
        tags: true,
      },
    });
    return plainToArticle(createdArticle);
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const data: ArticleUncheckedUpdateInput = {};
    data.title = updateArticleDto.title;
    data.content = updateArticleDto.content;
    data.status = updateArticleDto.status;
    data.categoryId = updateArticleDto.categoryId;
    data.updatedAt = new Date();
    if (updateArticleDto.tags) {
      data.tags = {
        connectOrCreate: updateArticleDto.tags.map((tag) => {
          return {
            where: { name: tag },
            create: { name: tag, id: randomUUID() },
          };
        }),
      };
    }
    try {
      const updatedArticle = await this.prisma.article.update({
        data: data,
        where: { id: id },
        include: { tags: true },
      });
      return plainToArticle(updatedArticle);
    } catch (e) {
      throw new NotFoundError(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.article.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundError(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
    }
  }
}
