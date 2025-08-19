import { ObjectId } from 'mongodb';
import { AggregateRoot } from '../libs/ddd/aggregate-root.base';
import { AggregateID } from '../libs/ddd/entity.base';

export type MealProps = {
  name: string;
  categoryId: string;
  price: number;
};

export type CreateMealProps = {
  name: string;
  categoryId: string;
  price: number;
};

export class Meal extends AggregateRoot<MealProps> {
  protected _id!: AggregateID;

  static create(props: CreateMealProps): Meal {
    return new Meal({
      id: new ObjectId().toString(),
      props: {
        name: props.name,
        categoryId: props.categoryId,
        price: props.price,
      },
    });
  }
}
