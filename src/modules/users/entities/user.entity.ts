import { Exclude, Transform } from 'class-transformer';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomUUID } from 'node:crypto';
import { Role } from '../../../contants';

export class User {
  id: string = randomUUID(); // uuid v4
  login: string;
  @Exclude({ toPlainOnly: true })
  password: string;
  role: 'admin' | 'editor' | 'viewer' = Role.VIEWER;
  @Transform(
    ({ value }) => {
      return +value;
    },
    { toPlainOnly: true },
  )
  createdAt: Date; // timestamp of creation
  @Transform(
    ({ value }) => {
      return +value;
    },
    { toPlainOnly: true },
  )
  updatedAt: Date; // timestamp of last update
  constructor(createUserDto: CreateUserDto) {
    Object.assign(this, createUserDto);
  }
}
