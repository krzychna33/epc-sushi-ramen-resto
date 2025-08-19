import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RepositoryBase } from '../../libs/database/repository.base';
import { OrderSchema } from '@orders/db/order.schema';
import { Order, OrderStatus } from '@orders/Order';
import { OrderMapper } from '@orders/db/order.mapper';

export type OrderQueryFilters = {
  status?: OrderStatus;
};

@Injectable()
export class OrdersRepository extends RepositoryBase<OrderSchema, Order> {
  public constructor(
    @InjectModel(OrderSchema.name)
    protected readonly orderModel: Model<OrderSchema>,
    protected readonly orderMapper: OrderMapper,
  ) {
    super(orderModel, orderMapper);
  }

  public findOneById(id: string): Promise<Order | null> {
    return this.findOne({ _id: new ObjectId(id) });
  }

  public findByFilters(filters: OrderQueryFilters): Promise<Order[]> {
    return this.find({ ...(filters.status ? { status: filters.status } : {}) });
  }

  async update(character: Order): Promise<Order> {
    await this.findOneAndReplace(
      { _id: new ObjectId(character.id) },
      character,
    );

    return character;
  }
}
