import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Category } from '../Category';
import { CategorySchema } from './category.schema';
import { EntityMapper } from '../../libs/ddd/entity-mapper.interface';

@Injectable()
export class CategoryMapper implements EntityMapper<CategorySchema, Category> {
  toSchema(entity: Category): CategorySchema {
    const props = entity.getProps();

    return {
      _id: new ObjectId(props.id),
      name: props.name,
    };
  }

  toEntity(entitySchema: CategorySchema): Category {
    return new Category({
      id: entitySchema._id.toString(),
      props: {
        name: entitySchema.name,
      },
    });
  }
}
