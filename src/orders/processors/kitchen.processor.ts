import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import {
  OrderDeliveryQueueJobs,
  OrderQueues,
} from '@orders/order-queue.options';
import { OrderStatus } from '@orders/Order';
import { OrdersService } from '@orders/orders.service';

@Processor(OrderQueues.KITCHEN_QUEUE)
export class KitchenProcessor extends WorkerHost {
  public constructor(
    private readonly ordersService: OrdersService,
    @InjectQueue(OrderQueues.DELIVERY_QUEUE)
    private readonly orderDeliveryQueue: Queue,
  ) {
    super();
  }
  private readonly logger = new Logger(KitchenProcessor.name);

  async process(job: Job<string>) {
    try {
      const orderId = job.data;

      this.logger.log(`Order ${orderId} is being processed in the kitchen...`);

      const order = await this.ordersService.getOrderById(orderId);

      order.changeStatus(OrderStatus.IN_THE_KITCHEN);
      await order.prepareOrder();

      await this.ordersService.updateOrder(order);
      await this.orderDeliveryQueue.add(
        OrderDeliveryQueueJobs.DELIVER_ORDER,
        orderId,
      );

      this.logger.log(`Order ${order.id} has been processed successfully.`);
    } catch (error) {
      this.logger.error(`Failed to process order:`, error);
      throw error;
    }
  }
}
