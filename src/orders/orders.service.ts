import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Order } from '@orders/Order';
import { Meal } from '@meals/Meal';
import {
  OrderKitchenQueueJobs,
  OrderQueues,
} from '@orders/order-queue.options';
import { OrdersRepository } from '@orders/db/orders.repository';
import { MealsService } from '@meals/meals.service';
import {
  CreateOrderMealsDto,
  CreateOrderRequest,
} from '@orders/dto/create-order.dto';
import { GetOrdersQueryRequest } from '@orders/dto/get-orders.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  public constructor(
    private readonly mealsService: MealsService,
    @InjectQueue(OrderQueues.KITCHEN_QUEUE)
    private readonly orderKitchenQueue: Queue,
    private readonly orderRepository: OrdersRepository,
  ) {}

  public async createOrder(
    createOrderRequest: CreateOrderRequest,
  ): Promise<Order> {
    const order = Order.create();

    const meals = await this.mealsService.getMealsByIds(
      createOrderRequest.meals.map((meal) => meal.mealId),
    );

    const mealsMap = new Map<string, Meal>();

    meals.forEach((meal) => {
      mealsMap.set(meal.id, meal);
    });

    createOrderRequest.meals.forEach((meal: CreateOrderMealsDto) => {
      const existingMeal = mealsMap.get(meal.mealId);
      if (!existingMeal) {
        throw new BadRequestException(
          `Meal with ID ${meal.mealId} does not exist`,
        );
      }
      const existingMealProps = existingMeal.getProps();
      order.addMeal(
        meal.mealId,
        existingMealProps.name,
        existingMealProps.price,
        meal.quantity,
      );
    });

    await this.orderRepository.create(order);

    await this.orderKitchenQueue.add(
      OrderKitchenQueueJobs.PROCESS_ORDER,
      order.id,
    );

    this.orderKitchenQueue.getJobCounts().then(console.log);

    this.logger.log(
      `Order has been created with ID: ${order.id} and added to the kitchen queue.`,
    );

    return order;
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOneById(id);

    if (!order) {
      throw new BadRequestException(`Order with ID ${id} does not exist`);
    }

    return order;
  }

  async getOrders(queryDto: GetOrdersQueryRequest): Promise<Order[]> {
    return this.orderRepository.findByFilters({
      status: queryDto.status,
    });
  }

  async updateOrder(order: Order): Promise<void> {
    await this.orderRepository.update(order);
  }
}
