import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { MealSchema } from '@meals/db/meal.schema';
import { MealsRepository } from '@meals/db/meals.repository';
import { MealMapper } from '@meals/db/meal.mapper';
import { CategoriesModule } from '@categories/categories.module';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MealSchema.name,
        schema: SchemaFactory.createForClass(MealSchema),
      },
    ]),
    CategoriesModule,
  ],
  controllers: [MealsController],
  providers: [MealsService, MealsRepository, MealMapper],
  exports: [MealsService],
})
export class MealsModule {}
