import { AggregateRoot } from '../libs/ddd/aggregate-root.base';

export type OrderMeal = {
  mealId: string;
  name: string;
  quantity: number;
  price: number;
};

export enum OrderStatus {
  NEW = 'new',
  IN_THE_KITCHEN = 'inTheKitchen',
  IN_DELIVERY = 'inDelivery',
  DONE = 'done',
}

export type OrderProps = {
  meals: OrderMeal[];
  status: OrderStatus;
  totalPrice: number;
};

export class Order extends AggregateRoot<OrderProps> {
  protected _id!: string;

  static create(): Order {
    return new Order({
      id: crypto.randomUUID(),
      props: {
        meals: [],
        status: OrderStatus.NEW,
        totalPrice: 0,
      },
    });
  }

  addMeal(
    mealId: string,
    name: string,
    price: number,
    quantity: number = 1,
  ): void {
    if (this.props.status !== OrderStatus.NEW) {
      throw new Error('Cannot add meals to an order that is not new');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (price < 0) {
      throw new Error('Price cannot be negative');
    }

    const existingMealIndex = this.props.meals.findIndex(
      (meal) => meal.mealId === mealId,
    );

    if (existingMealIndex >= 0) {
      // Update existing meal quantity
      this.props.meals[existingMealIndex].quantity += quantity;
    } else {
      // Add new meal
      this.props.meals.push({
        mealId,
        name,
        quantity,
        price,
      });
    }

    this.calculateTotalPrice();
  }

  removeMeal(mealId: string): void {
    if (this.props.status !== OrderStatus.NEW) {
      throw new Error('Cannot remove meals from an order that is not new');
    }

    this.props.meals = this.props.meals.filter(
      (meal) => meal.mealId !== mealId,
    );
    this.calculateTotalPrice();
  }

  updateMealQuantity(mealId: string, quantity: number): void {
    if (this.props.status !== OrderStatus.NEW) {
      throw new Error(
        'Cannot update meal quantity for an order that is not new',
      );
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const meal = this.props.meals.find((meal) => meal.mealId === mealId);
    if (!meal) {
      throw new Error('Meal not found in order');
    }

    meal.quantity = quantity;
    this.calculateTotalPrice();
  }

  changeStatus(newStatus: OrderStatus): void {
    const validTransitions = this.getValidStatusTransitions();

    if (!validTransitions.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${this.props.status} to ${newStatus}`,
      );
    }

    this.props.status = newStatus;
  }

  private getValidStatusTransitions(): OrderStatus[] {
    switch (this.props.status) {
      case OrderStatus.NEW:
        return [OrderStatus.IN_THE_KITCHEN];
      case OrderStatus.IN_THE_KITCHEN:
        return [OrderStatus.IN_DELIVERY];
      case OrderStatus.IN_DELIVERY:
        return [OrderStatus.DONE];
      case OrderStatus.DONE:
        return []; // No further transitions allowed
      default:
        return [];
    }
  }

  private calculateTotalPrice(): void {
    this.props.totalPrice = this.props.meals.reduce(
      (total, meal) => total + meal.price * meal.quantity,
      0,
    );
  }

  getTotalPrice(): number {
    return this.props.totalPrice;
  }

  getMeals(): readonly OrderMeal[] {
    return Object.freeze([...this.props.meals]);
  }

  getStatus(): OrderStatus {
    return this.props.status;
  }

  canAddMeals(): boolean {
    return this.props.status === OrderStatus.NEW;
  }

  isEmpty(): boolean {
    return this.props.meals.length === 0;
  }
}
