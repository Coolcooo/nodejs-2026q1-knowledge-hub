import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  SerializeOptions,
  ClassSerializerInterceptor,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { StatusCodes } from 'http-status-codes';
import { CheckPolicies } from '../../metadata/roles.metadata';
import { CreatePolicyHandler } from './policy-handlers/create.handler';
import { ReadPolicyHandler } from './policy-handlers/read.handler';
import { UpdatePolicyHandler } from './policy-handlers/update.handler';
import { DeletePolicyHandler } from './policy-handlers/delete.handler';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: User })
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @CheckPolicies(new CreatePolicyHandler())
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @CheckPolicies(new ReadPolicyHandler())
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @CheckPolicies(new ReadPolicyHandler())
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.findOne(id);
  }

  @CheckPolicies(new UpdatePolicyHandler())
  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @CheckPolicies(new DeletePolicyHandler())
  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.remove(id);
  }
}
