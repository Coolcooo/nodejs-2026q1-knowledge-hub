import { TCreateUserDto, TRole } from 'src/types';
import { IsString, IsIn, IsOptional } from 'class-validator';
import { Role, Roles } from 'src/contants';

export class CreateUserDto implements TCreateUserDto {
  @IsString()
  readonly login: string;
  @IsString()
  readonly password: string;
  @IsIn(Roles)
  @IsOptional()
  readonly role?: TRole = Role.VIEWER;
}
