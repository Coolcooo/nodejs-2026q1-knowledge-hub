import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { SkipAuth } from './auth.metadata';
import { ThrottlerGuard } from '@nestjs/throttler';
import { User } from '../users/entities/user.entity';

@UseGuards(ThrottlerGuard)
@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: User })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @Body()
    data: RefreshDto,
  ) {
    if (typeof data.refreshToken !== 'string') {
      throw new UnauthorizedException();
    }
    return this.authService.refresh(data);
  }
}
