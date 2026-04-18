import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HTTP_CODE_MESSAGES } from 'src/contants';
import { PrismaService } from '../../external/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    await this.prisma.user.create({
      data: user,
    });
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((e) => plainToInstance(User, e));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
    }
    return plainToInstance(User, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
      }
      if (user.password !== updateUserDto.oldPassword) {
        throw new ForbiddenException(HTTP_CODE_MESSAGES.PASSWORD_IS_WRONG);
      }
      user.password = updateUserDto.newPassword;
      user.updatedAt = new Date();
      await tx.user.update({ where: { id }, data: user });
      return plainToInstance(User, user);
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundException(HTTP_CODE_MESSAGES.ID_NOT_FOUND);
    }
  }
}
