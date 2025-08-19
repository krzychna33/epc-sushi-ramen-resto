import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { MealsService } from './meals.service';
import {
  CreateMealDto,
  CreateMealResponseDto,
} from '@meals/dto/create-meal.dto';
import { GetMealsDto } from '@meals/dto/get-meals.dto';

@ApiTags('Meals')
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  public async getMeals(): Promise<GetMealsDto> {
    const meals = await this.mealsService.getMeals();
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
