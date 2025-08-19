import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { MealsService } from './meals.service';
import {
  CreateMealDto,
  CreateMealResponseDto,
} from '@meals/dto/create-meal.dto';
import { GetMealsDto, GetMealsQueryRequest } from '@meals/dto/get-meals.dto';

@ApiTags('Meals')
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all meals or filter by category' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter meals by category ID',
    type: String,
  })
  public async getMeals(
    @Query() queryDto: GetMealsQueryRequest,
  ): Promise<GetMealsDto> {
    const meals = await this.mealsService.getMeals(queryDto);
    return plainToInstance<GetMealsDto, GetMealsDto>(GetMealsDto, {
      data: meals.map((meal) => meal.getProps()),
    });
  }

  @Post()
  async addMeal(@Body() meal: CreateMealDto): Promise<CreateMealResponseDto> {
    const createdMeal = await this.mealsService.createMeal(meal);
    return plainToInstance<CreateMealResponseDto, CreateMealResponseDto>(
      CreateMealResponseDto,
      {
        data: { ...createdMeal.getProps() },
      },
    );
  }
}
