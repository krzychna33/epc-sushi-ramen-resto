import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { MealDto } from '@meals/dto/meal.dto';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsNotEmpty()
  public categoryId!: string;

  @IsNumber()
  @Min(0)
  public price!: number;
}

export class CreateMealResponseDto {
  public data!: MealDto;
}
