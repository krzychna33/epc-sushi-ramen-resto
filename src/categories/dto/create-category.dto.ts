import { IsNotEmpty, IsString } from 'class-validator';
import { CategoryDto } from '@categories/dto/category.dto';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;
}

export class CreateCategoryResponseDto {
  public data!: CategoryDto;
}
