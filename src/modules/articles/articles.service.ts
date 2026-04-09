import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { HTTP_CODE_MESSAGES } from 'src/contants';
import { GetArticleDto } from './dto/get-article.dto';
import { CommentsService } from '../comments/comments.service';
@Injectable()
export class ArticlesService {
  articles: Article[] = [];
  constructor(
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
  ) {}
  findAll(getArticleDto: GetArticleDto) {
    let result = this.articles;
    if (typeof getArticleDto.status === 'string') {
      result = result.filter(
        (article) => article.status === getArticleDto.status,
      );
    }
    if (typeof getArticleDto.categoryId === 'string') {
      result = result.filter(
        (article) => article.categoryId === getArticleDto.categoryId,
      );
    }
    if (typeof getArticleDto.tag === 'string') {
      result = result.filter((article) =>
        article.tags.some((tag) => tag === getArticleDto.tag),
      );
    }

    return result;
  }
  findOne(id: string) {
    for (let i = 0; i < this.articles.length; i += 1) {
      const article = this.articles[i];
      if (article.id === id) {
        return article;
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }
  create(createArticleDto: CreateArticleDto) {
    const article = new Article(createArticleDto);
    this.articles.push(article);
    return article;
  }
  update(id: string, updateArticleDto: UpdateArticleDto) {
    for (let i = 0; i < this.articles.length; i += 1) {
      const article = this.articles[i];
      if (article.id === id) {
        Object.assign(article, updateArticleDto);
        article.updatedAt = +new Date();
        return article;
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }
  delete(id: string) {
    for (let i = this.articles.length - 1; i >= 0; i -= 1) {
      const article = this.articles[i];
      if (article.id === id) {
        this.articles.splice(i, 1);
        this.commentsService.unlinkByArticleId(id);
        return;
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }
  unlinkByUserId(userId: string) {
    for (let i = this.articles.length - 1; i >= 0; i -= 1) {
      const article = this.articles[i];
      if (article.authorId === userId) {
        article.authorId = null;
      }
    }
  }
  unlinkByCategoryId(categoryId: string) {
    for (let i = this.articles.length - 1; i >= 0; i -= 1) {
      const article = this.articles[i];
      if (article.categoryId === categoryId) {
        article.categoryId = null;
      }
    }
  }
}
