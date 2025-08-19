import { ObjectId } from 'mongodb';
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
      id: new ObjectId().toString(),
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
      this.props.meals[existingMealIndex].quantity += quantity;
    } else {
      this.props.meals.push({
        mealId,
        name,
        quantity,
        price,
      });
    }

    this.calculateTotalPrice();
  }

  async prepareOrder() {
    if (this.getStatus() !== OrderStatus.IN_THE_KITCHEN) {
      throw new Error(`Order must be in delivery to complete delivery`);
    }

    for (const meal of this.props.meals) {
      await new Promise((resolve) => setTimeout(resolve, 100 * meal.quantity));
    }
  }

  async deliverOrder() {
    if (this.getStatus() !== OrderStatus.IN_DELIVERY) {
      throw new Error(`Order must be in delivery to complete delivery`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
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
        return [];
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

  getStatus(): OrderStatus {
    return this.props.status;
  }
}
