import { AggregateRoot } from '../libs/ddd/aggregate-root.base';

export type MealProps = {
  name: string;
  categoryId: string;
  price: number;
};

export class Meal extends AggregateRoot<MealProps> {
  protected _id!: string;

  static create(props: MealProps): Meal {
    return new Meal({
      id: crypto.randomUUID(),
      props: {
        name: props.name,
        categoryId: props.categoryId,
        price: props.price,
      },
    });
  }
}
