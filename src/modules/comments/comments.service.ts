import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entity/comment.entity';
import { HTTP_CODE_MESSAGES } from '../../contants';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class CommentsService {
  comments: Comment[] = [];
  constructor(
    @Inject(forwardRef(() => ArticlesService))
    private readonly articleService: ArticlesService,
  ) {}
  getByArticleId(articleId: string) {
    return this.comments.filter((comment) => comment.articleId === articleId);
  }
  findOne(id: string) {
    for (let i = this.comments.length - 1; i >= 0; i -= 1) {
      if (this.comments[i].id === id) {
        return this.comments[i];
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }
  create(createCommentDto: CreateCommentDto) {
    try {
      this.articleService.findOne(createCommentDto.articleId);
    } catch (e) {
      throw new UnprocessableEntityException(
        HTTP_CODE_MESSAGES.ARTICLE_IS_NOT_FOUND,
      );
    }
    const comment = new Comment(createCommentDto);
    this.comments.push(comment);
    return comment;
  }
  delete(id: string) {
    for (let i = this.comments.length - 1; i >= 0; i -= 1) {
      if (this.comments[i].id === id) {
        this.comments.splice(i, 1);
        return;
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }
  unlinkByArticleId(articleId: string) {
    for (let i = this.comments.length - 1; i >= 0; i -= 1) {
      if (this.comments[i].articleId === articleId) {
        this.comments.splice(i, 1);
      }
    }
  }
  unlinkByUserId(authorId: string) {
    for (let i = this.comments.length - 1; i >= 0; i -= 1) {
      if (this.comments[i].authorId === authorId) {
        this.comments.splice(i, 1);
      }
    }
  }
}
