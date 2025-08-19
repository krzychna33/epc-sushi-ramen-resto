import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { OrderQueues } from '@orders/order-queue.options';
import { KitchenProcessor } from '@orders/processors/kitchen.processor';
import { OrdersRepository } from '@orders/db/orders.repository';
import { OrderSchema } from '@orders/db/order.schema';
import { OrderMapper } from '@orders/db/order.mapper';
import { DeliveryProcessor } from '@orders/processors/delivery.processor';
import { MealsModule } from '@meals/meals.module';
import { OrdersService } from '@orders/orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    MealsModule,
    MongooseModule.forFeature([
      {
        name: OrderSchema.name,
        schema: SchemaFactory.createForClass(OrderSchema),
      },
    ]),
    BullModule.registerQueue({
      name: OrderQueues.KITCHEN_QUEUE,
    }),
    BullModule.registerQueue({
      name: OrderQueues.DELIVERY_QUEUE,
    }),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    OrderMapper,
    KitchenProcessor,
    DeliveryProcessor,
  ],
})
export class OrdersModule {}
