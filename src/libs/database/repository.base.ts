import { Model, FilterQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { IdentifiableEntitySchema } from './identifable-entity.schema';
import { EntityBase } from '../ddd/entity.base';
import { EntityMapper } from '../ddd/entity-mapper.interface';

export abstract class RepositoryBase<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends EntityBase<any>,
> {
  constructor(
    protected readonly entityModel: Model<TSchema>,
    protected readonly entityMapper: EntityMapper<TSchema, TEntity>,
  ) {}

  protected async findOne(
    entityFilterQuery?: FilterQuery<TSchema>,
  ): Promise<TEntity | null> {
    const entityDocument = await this.entityModel.findOne(
      entityFilterQuery,
      {},
    );

    return entityDocument ? this.entityMapper.toEntity(entityDocument) : null;
  }

  public async find(
    entityFilterQuery: FilterQuery<TSchema>,
  ): Promise<TEntity[]> {
    return (await this.entityModel.find(entityFilterQuery, {})).map(
      (entityDocument) => this.entityMapper.toEntity(entityDocument),
    );
  }

  async create(entity: TEntity): Promise<void> {
    await new this.entityModel(this.entityMapper.toSchema(entity)).save();
  }

  async deleteAll(): Promise<void> {
    await this.entityModel.deleteMany({});
  }

  protected async findOneAndReplace(
    entityFilterQuery: FilterQuery<TSchema>,
    entity: TEntity,
  ): Promise<void> {
    const updatedEntityDocument = await this.entityModel.findOneAndReplace(
      entityFilterQuery,
      this.entityMapper.toSchema(entity),
      {
        new: true,
        useFindAndModify: false,
        lean: true,
      },
    );

    if (!updatedEntityDocument) {
      throw new NotFoundException('Unable to find the entity to replace.');
    }
  }
}
