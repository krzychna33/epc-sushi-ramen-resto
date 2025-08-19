import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Meal } from '@meals/Meal';
import { MealsRepository } from '@meals/db/meals.repository';
import { CategoriesService } from '@categories/categories.service';
import { CreateMealDto } from '@meals/dto/create-meal.dto';
import { GetMealsQueryRequest } from './dto/get-meals.dto';

@Injectable()
export class MealsService {
  public constructor(
    private readonly mealsRepository: MealsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  public getMeals(queryDto: GetMealsQueryRequest): Promise<Meal[]> {
    return this.mealsRepository.findByFilters({
      categoryId: queryDto.categoryId,
    });
  }

  public async getMealsByIds(id: string[]): Promise<Meal[]> {
    const meals = await this.mealsRepository.findManyByIds(id);
    return meals;
  }

  async createMeal(dto: CreateMealDto): Promise<Meal> {
    const categoryExists = await this.categoriesService.categoryExists(
      dto.categoryId,
    );
    if (!categoryExists) {
      throw new BadRequestException('Category does not exist');
    }

    try {
      const meal = Meal.create({
        name: dto.name,
        categoryId: dto.categoryId,
        price: dto.price,
      });

      await this.mealsRepository.create(meal);

      return meal;
    } catch (e) {
      if (e instanceof MongoServerError && e.code === 11000) {
        throw new ConflictException('Meal already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
