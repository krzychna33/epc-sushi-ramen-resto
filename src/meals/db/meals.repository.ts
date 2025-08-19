import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { RepositoryBase } from '../../libs/database/repository.base';
import { MealSchema } from '@meals/db/meal.schema';
import { Meal } from '@meals/Meal';
import { MealMapper } from '@meals/db/meal.mapper';

export class MealsRepository extends RepositoryBase<MealSchema, Meal> {
  public constructor(
    @InjectModel(MealSchema.name)
    protected readonly mealModel: Model<MealSchema>,
    protected readonly mealMapper: MealMapper,
  ) {
    super(mealModel, mealMapper);
  }

  public findManyByIds(ids: string[]): Promise<Meal[]> {
    return this.find({ _id: { $in: ids.map((id) => new ObjectId(id)) } });
  }
}
