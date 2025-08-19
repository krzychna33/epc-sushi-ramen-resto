import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { OrderSchema } from '@orders/db/order.schema';
import { Order } from '@orders/Order';
import { EntityMapper } from '../../libs/ddd/entity-mapper.interface';

@Injectable()
export class OrderMapper implements EntityMapper<OrderSchema, Order> {
  toSchema(entity: Order): OrderSchema {
    const props = entity.getProps();

    return {
      _id: new ObjectId(props.id),
      status: props.status,
      totalPrice: props.totalPrice,
      orderMeals: props.meals.map((meal) => ({
        mealId: meal.mealId,
        quantity: meal.quantity,
        name: meal.name,
        price: meal.price,
      })),
    };
  }

  toEntity(entitySchema: OrderSchema): Order {
    return new Order({
      id: entitySchema._id.toString(),
      props: {
        status: entitySchema.status,
        totalPrice: entitySchema.totalPrice,
        meals: entitySchema.orderMeals.map((meal) => ({
          mealId: meal.mealId,
          quantity: meal.quantity,
          name: meal.name,
          price: meal.price,
        })),
      },
    });
  }
}
