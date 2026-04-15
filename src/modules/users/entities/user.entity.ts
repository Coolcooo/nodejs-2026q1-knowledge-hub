import { Exclude, Transform } from 'class-transformer';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomUUID } from 'node:crypto';

export class User {
  id: string = randomUUID(); // uuid v4
  login: string;
  @Exclude()
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  @Transform(({ value }) => +value)
  createdAt: Date = new Date(); // timestamp of creation
  @Transform(({ value }) => +value)
  updatedAt: Date = new Date(); // timestamp of last update
  constructor(createUserDto: CreateUserDto) {
    Object.assign(this, createUserDto);
  }
}
