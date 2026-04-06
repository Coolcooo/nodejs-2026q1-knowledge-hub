import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  readonly content: string;
  @IsUUID(4)
  readonly articleId: string;
  @IsUUID(4)
  @IsOptional()
  authorId: string | null;
}
