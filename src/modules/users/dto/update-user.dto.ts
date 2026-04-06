import { TUpdateUserDto } from 'src/types';
import { IsString } from 'class-validator';

export class UpdateUserDto implements TUpdateUserDto {
  @IsString()
  readonly oldPassword: string;
  @IsString()
  readonly newPassword: string;
}
