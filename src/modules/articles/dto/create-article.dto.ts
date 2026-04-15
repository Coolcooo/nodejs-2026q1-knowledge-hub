import { IsEnum, IsString, IsUUID, ValidateIf } from 'class-validator';
import { Status } from '../../../generated/prisma/enums';

export class CreateArticleDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly content: string;
  @IsEnum(Status)
  readonly status: Status;
  @IsString({ each: true })
  readonly tags: string[];
  @IsUUID(4)
  @ValidateIf((object, value) => value !== null)
  authorId: string | null;
  @IsUUID(4)
  @ValidateIf((object, value) => value !== null)
  categoryId: string | null;
}
