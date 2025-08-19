import { ObjectId } from 'mongodb';
import { AggregateRoot } from '../libs/ddd/aggregate-root.base';
import { AggregateID } from '../libs/ddd/entity.base';

export type CategoryProps = {
  name: string;
};

export type CreateCategoryProps = {
  name: string;
};

export class Category extends AggregateRoot<CategoryProps> {
  protected _id!: AggregateID;

  static create(props: CreateCategoryProps): Category {
    return new Category({
      id: new ObjectId().toString(),
      props: {
        name: props.name,
      },
    });
  }
}
