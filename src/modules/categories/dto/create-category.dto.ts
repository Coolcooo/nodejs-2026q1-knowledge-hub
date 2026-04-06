import { TCreateCategoryDto } from '../../../types';
import { IsString } from 'class-validator';

export class CreateCategoryDto implements TCreateCategoryDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly description: string;
}
