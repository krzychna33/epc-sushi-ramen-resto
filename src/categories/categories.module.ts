import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { CategorySchema } from '@categories/db/category.schema';
import { CategoriesRepository } from '@categories/db/categories.repository';
import { CategoryMapper } from '@categories/db/category.mapper';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CategorySchema.name,
        schema: SchemaFactory.createForClass(CategorySchema),
      },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, CategoryMapper],
})
export class CategoriesModule {}
