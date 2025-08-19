import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { OrderQueues } from '@orders/order-queue.options';
import { OrderStatus } from '@orders/Order';
import { OrdersService } from '@orders/orders.service';

@Processor(OrderQueues.DELIVERY_QUEUE)
export class DeliveryProcessor extends WorkerHost {
  public constructor(private readonly ordersService: OrdersService) {
    super();
  }
  private readonly logger = new Logger(DeliveryProcessor.name);

  async process(job: Job<string>) {
    try {
      const orderId = job.data;

      this.logger.log(`Order ${orderId} is being delivered...`);

      const order = await this.ordersService.getOrderById(orderId);

      order.changeStatus(OrderStatus.IN_DELIVERY);
      await order.deliverOrder();
      order.changeStatus(OrderStatus.DONE);

      await this.ordersService.updateOrder(order);

      this.logger.log(`Order ${order.id} has been delivered successfully.`);
    } catch (error) {
      this.logger.error(`Failed to process order:`, error);
      throw error;
    }
  }
}
