export class OrderMealDto {
  public mealId!: string;
  public name!: string;
  public quantity!: number;
}

export class OrderDto {
  public id!: string;
  public meals!: OrderMealDto[];
  public totalPrice!: number;
  public status!: string;
}
