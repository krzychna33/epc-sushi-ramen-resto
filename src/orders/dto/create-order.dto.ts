import {
  IsMongoId,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDto } from '@orders/dto/order.dto';

export class CreateOrderMealsDto {
  @IsMongoId()
  public mealId!: string;

  @IsNumber()
  @IsPositive()
  public quantity!: number;
}

export class CreateOrderRequest {
  @ValidateNested()
  @Type(() => CreateOrderMealsDto)
  public meals!: CreateOrderMealsDto[];
}

export class CreateOrderResponse {
  public data!: OrderDto;
}
