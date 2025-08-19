import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '../../libs/database/identifable-entity.schema';

@Schema({ collection: 'categories' })
export class CategorySchema extends IdentifiableEntitySchema {
  @Prop({ required: true, trim: true, unique: true })
  name!: string;
}
