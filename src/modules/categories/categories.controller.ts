import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';
import { CheckPolicies } from '../../metadata/roles.metadata';
import { ReadPolicyHandler } from './policy-handlers/read.handler';
import { CreatePolicyHandler } from './policy-handlers/create.handler';
import { UpdatePolicyHandler } from './policy-handlers/update.handler';
import { DeletePolicyHandler } from './policy-handlers/delete.handler';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @CheckPolicies(new ReadPolicyHandler())
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @CheckPolicies(new ReadPolicyHandler())
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.categoriesService.findOne(id);
  }

  @CheckPolicies(new CreatePolicyHandler())
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @CheckPolicies(new UpdatePolicyHandler())
  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @CheckPolicies(new DeletePolicyHandler())
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.categoriesService.delete(id);
  }
}
