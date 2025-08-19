import { IsMongoId, IsOptional } from 'class-validator';
import { MealDto } from '@meals/dto/meal.dto';

export class GetMealsQueryRequest {
  @IsOptional()
  @IsMongoId()
  public categoryId?: string;
}

export class GetMealsDto {
  public data!: MealDto[];
}
