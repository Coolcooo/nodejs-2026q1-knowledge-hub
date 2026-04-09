import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HTTP_CODE_MESSAGES } from 'src/contants';
import { ArticlesService } from '../articles/articles.service';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class UsersService {
  users: User[] = [];
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly commentsService: CommentsService,
  ) {}
  create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    for (let i = 0; i < this.users.length; i += 1) {
      if (this.users[i].id === id) {
        return this.users[i];
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    for (let i = 0; i < this.users.length; i += 1) {
      const user = this.users[i];
      if (user.id === id) {
        if (user.password === updateUserDto.oldPassword) {
          user.password = updateUserDto.newPassword;
          user.updatedAt = +new Date();
        } else {
          throw new ForbiddenException(HTTP_CODE_MESSAGES.PASSWORD_IS_WRONG);
        }
        return;
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }

  remove(id: string) {
    for (let i = this.users.length - 1; i >= 0; i -= 1) {
      const user = this.users[i];
      if (user.id === id) {
        this.articlesService.unlinkByUserId(id);
        this.commentsService.unlinkByUserId(id);
        this.users.splice(i, 1);
        return;
      }
    }
    throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
  }
}
