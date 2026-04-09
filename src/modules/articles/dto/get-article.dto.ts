import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { ArticleStatuses } from '../../../contants';

export class GetArticleDto {
  @IsIn(ArticleStatuses)
  @IsOptional()
  readonly status?: string;
  @IsUUID(4)
  @IsOptional()
  readonly categoryId?: string;
  @IsString()
  @IsOptional()
  readonly tag?: string;
}
