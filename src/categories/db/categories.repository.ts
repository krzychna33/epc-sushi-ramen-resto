import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryBase } from '../../libs/database/repository.base';
import { CategorySchema } from '@categories/db/category.schema';
import { Category } from '@categories/Category';
import { CategoryMapper } from '@categories/db/category.mapper';

export class CategoriesRepository extends RepositoryBase<
  CategorySchema,
  Category
> {
  public constructor(
    @InjectModel(CategorySchema.name)
    protected readonly categoryModel: Model<CategorySchema>,
    protected readonly categoryMapper: CategoryMapper,
  ) {
    super(categoryModel, categoryMapper);
  }
}
