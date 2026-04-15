import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entity/comment.entity';
import { HTTP_CODE_MESSAGES } from '../../contants';
import { PrismaService } from '../../external/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}
  async getByArticleId(articleId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { articleId },
    });
    return comments.map((e) => plainToInstance(Comment, e));
  }
  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
    }
    return plainToInstance(Comment, comment);
  }
  async create(createCommentDto: CreateCommentDto) {
    try {
      const comment = new Comment(createCommentDto);
      await this.prisma.comment.create({
        data: comment,
      });
      return comment;
    } catch (e) {
      throw new UnprocessableEntityException(
        HTTP_CODE_MESSAGES.ARTICLE_IS_NOT_FOUND,
      );
    }
  }
  async delete(id: string) {
    try {
      await this.prisma.comment.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
    }
  }
}
