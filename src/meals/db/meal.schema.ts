import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '../../libs/database/identifable-entity.schema';

@Schema({ collection: 'meals' })
export class MealSchema extends IdentifiableEntitySchema {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true })
  categoryId!: string;

  @Prop({ required: true, min: 0 })
  price!: number;
}
