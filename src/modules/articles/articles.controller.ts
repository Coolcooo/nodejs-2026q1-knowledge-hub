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
  Put,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { StatusCodes } from 'http-status-codes';
import { GetArticleDto } from './dto/get-article.dto';
import { Article } from './entities/article.entity';
import { CheckPolicies } from '../../metadata/roles.metadata';
import { ReadPolicyHandler } from './policy-handlers/read.handler';
import { CreatePolicyHandler } from './policy-handlers/create.handler';
import { UpdatePolicyHandler } from './policy-handlers/update.handler';
import { DeletePolicyHandler } from './policy-handlers/delete.handler';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: Article })
@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @CheckPolicies(new ReadPolicyHandler())
  @Get()
  findAll(@Query() getArticleDto: GetArticleDto) {
    return this.articlesService.findAll(getArticleDto);
  }
  @CheckPolicies(new ReadPolicyHandler())
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.articlesService.findOne(id);
  }

  @CheckPolicies(new CreatePolicyHandler())
  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @CheckPolicies(new UpdatePolicyHandler())
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @CheckPolicies(new DeletePolicyHandler())
  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.articlesService.delete(id);
  }
}
