import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Status } from '../../../generated/prisma/enums';

export class GetArticleDto {
  @IsEnum(Status)
  @IsOptional()
  readonly status?: Status;
  @IsUUID(4)
  @IsOptional()
  readonly categoryId?: string;
  @IsString()
  @IsOptional()
  readonly tag?: string;
}
