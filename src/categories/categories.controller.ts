import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  CreateCategoryResponseDto,
} from '@categories/dto/create-category.dto';
import { GetCategoriesDto } from '@categories/dto/get-categories.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  public async getCategories(): Promise<GetCategoriesDto> {
    const categories = this.categoriesService.getCategories();
    const data = await categories;
    return plainToInstance<GetCategoriesDto, GetCategoriesDto>(
      GetCategoriesDto,
      {
        data: data.map((category) => category.getProps()),
      },
    );
  }

  @Post()
  async addCategory(
    @Body() category: CreateCategoryDto,
  ): Promise<CreateCategoryResponseDto> {
    const createdCategory =
      await this.categoriesService.createCategory(category);
    return plainToInstance<
      CreateCategoryResponseDto,
      CreateCategoryResponseDto
    >(CreateCategoryResponseDto, {
      data: { ...createdCategory.getProps() },
    });
  }
}
