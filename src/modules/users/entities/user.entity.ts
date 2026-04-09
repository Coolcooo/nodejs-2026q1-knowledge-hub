import { Exclude } from 'class-transformer';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomUUID } from 'node:crypto';

export class User {
  id: string = randomUUID(); // uuid v4
  login: string;
  @Exclude()
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: number = +new Date(); // timestamp of creation
  updatedAt: number = +new Date(); // timestamp of last update
  constructor(createUserDto: CreateUserDto) {
    Object.assign(this, createUserDto);
  }
}
