import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '../../libs/database/identifable-entity.schema';
import { OrderStatus } from '@orders/Order';

@Schema({ id: false })
export class OrderMealSchema {
  @Prop({ required: true, type: String })
  mealId!: string;

  @Prop({ required: true, type: Number })
  quantity!: number;

  @Prop({ required: true, type: String })
  name!: string;

  @Prop({ required: true, type: Number })
  price!: number;
}

const OrderMealRealSchema = SchemaFactory.createForClass(OrderMealSchema);

@Schema({ collection: 'orders' })
export class OrderSchema extends IdentifiableEntitySchema {
  @Prop({ required: true, type: String })
  public status!: OrderStatus;

  @Prop({ required: true, type: Number })
  totalPrice!: number;

  @Prop([OrderMealRealSchema])
  orderMeals!: OrderMealSchema[];
}
