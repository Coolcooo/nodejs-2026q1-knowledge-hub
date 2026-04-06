import { IsIn, IsString, IsUUID, ValidateIf } from 'class-validator';
import { TArcticleStatus } from '../../../types';
import { ArticleStatuses } from '../../../contants';

export class CreateArticleDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
  @IsIn(ArticleStatuses)
  readonly status: TArcticleStatus;
  @IsString({ each: true })
  readonly tags: string[];
  @IsUUID(4)
  @ValidateIf((object, value) => value !== null)
  authorId: string | null;
  @IsUUID(4)
  @ValidateIf((object, value) => value !== null)
  categoryId: string | null;
}
