import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Meal } from '../Meal';
import { MealSchema } from './meal.schema';
import { EntityMapper } from '../../libs/ddd/entity-mapper.interface';

@Injectable()
export class MealMapper implements EntityMapper<MealSchema, Meal> {
  toSchema(entity: Meal): MealSchema {
    const props = entity.getProps();

    return {
      _id: new ObjectId(props.id),
      name: props.name,
      categoryId: props.categoryId,
      price: props.price,
    };
  }

  toEntity(entitySchema: MealSchema): Meal {
    return new Meal({
      id: entitySchema._id.toString(),
      props: {
        name: entitySchema.name,
        categoryId: entitySchema.categoryId,
        price: entitySchema.price,
      },
    });
  }
}
