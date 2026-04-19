import { randomUUID } from 'crypto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Transform } from 'class-transformer';

export class Comment {
  id: string = randomUUID(); // uuid v4
  content: string;
  articleId: string; // refers to Article
  authorId: string | null; // refers to User
  @Transform(({ value }) => +value, { toPlainOnly: true })
  createdAt: Date; // timestamp of creation
  constructor(createCommentsDto: CreateCommentDto) {
    Object.assign(this, createCommentsDto);
  }
}
