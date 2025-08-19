import { IdentifiableEntitySchema } from '../database/identifable-entity.schema';
import { EntityBase } from './entity.base';

export interface EntityMapper<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends EntityBase<any>,
> {
  toSchema(entity: TEntity): TSchema;
  toEntity(entitySchema: TSchema): TEntity;
}
