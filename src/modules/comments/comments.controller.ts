import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';
import { StatusCodes } from 'http-status-codes';
import { Comment } from './entity/comment.entity';
import { CheckPolicies } from '../../metadata/roles.metadata';
import { ReadPolicyHandler } from './policy-handlers/read.handler';
import { CreatePolicyHandler } from './policy-handlers/create.handler';
import { DeletePolicyHandler } from './policy-handlers/delete.handler';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Comment })
@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @CheckPolicies(new ReadPolicyHandler())
  @Get()
  getByArticleId(
    @Query('articleId', new ParseUUIDPipe({ version: '4' })) articleId: string,
  ) {
    return this.commentsService.getByArticleId(articleId);
  }

  @CheckPolicies(new ReadPolicyHandler())
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.commentsService.findOne(id);
  }

  @CheckPolicies(new CreatePolicyHandler())
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @CheckPolicies(new DeletePolicyHandler())
  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.commentsService.delete(id);
  }
}
