import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { RefreshDto } from './dto/refresh.dto';
import { UsersService } from '../users/users.service';
import { genSalt, hash, compare } from 'bcrypt';
import { HTTP_CODE_MESSAGES } from '../../contants';
import 'dotenv/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../external/prisma.service';
import { User } from '../users/entities/user.entity';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async login(loginDto: LoginDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.usersService.findByLogin(loginDto.login, tx);
      if (!user) {
        throw new UnauthorizedException(HTTP_CODE_MESSAGES.AUTH_IS_WRONG);
      }
      const isEqualPasswords = await compare(loginDto.password, user.password);
      if (!isEqualPasswords) {
        throw new UnauthorizedException(HTTP_CODE_MESSAGES.AUTH_IS_WRONG);
      }
      return this.generateTokens(user, tx);
    });
  }

  async signUp(signUpDto: SignUpDto) {
    const salt = await genSalt(parseInt(process.env.CRYPT_SALT, 10));
    const hashedValue = await hash(signUpDto.password, salt);
    try {
      const userDto = {
        password: hashedValue,
        login: signUpDto.login,
      };
      const createdUser = await this.usersService.create(userDto);
      return createdUser;
    } catch (e) {
      throw new BadRequestException(HTTP_CODE_MESSAGES.LOGIN_IS_EXIST);
    }
  }

  async refresh(refreshDto: RefreshDto) {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(refreshDto.refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
    } catch (e) {
      throw new ForbiddenException();
    }

    return this.prisma.$transaction(async (tx) => {
      try {
        await tx.refreshToken.delete({
          where: {
            value: refreshDto.refreshToken,
          },
        });
      } catch (e) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findOne(payload.userId, tx);
      return this.generateTokens(user, tx);
    });
  }

  async generateTokens(
    user: User,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    const accessPayload = {
      userId: user.id,
      login: user.login,
      role: user.role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      this.jwtService.signAsync(accessPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    ]);
    await prisma.refreshToken.create({ data: { value: refreshToken } });
    return { accessToken, refreshToken };
  }
}
