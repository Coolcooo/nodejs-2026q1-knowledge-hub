import { TComment } from '../../../types';
import { randomUUID } from 'crypto';
import { CreateCommentDto } from '../dto/create-comment.dto';

export class Comment implements TComment {
  id: string = randomUUID(); // uuid v4
  content: string;
  articleId: string; // refers to Article
  authorId: string | null; // refers to User
  createdAt: number = +new Date(); // timestamp of creation
  constructor(createCommentsDto: CreateCommentDto) {
    Object.assign(this, createCommentsDto);
  }
}
