import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { OrdersService } from './orders.service';
import {
  CreateOrderRequest,
  CreateOrderResponse,
} from '@orders/dto/create-order.dto';
import { GetOrderResponseDto } from '@orders/dto/get-order.dto';
import {
  GetOrdersQueryRequest,
  GetOrdersResponse,
} from '@orders/dto/get-orders.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async createOrder(
    @Body() createOrderDto: CreateOrderRequest,
  ): Promise<CreateOrderResponse> {
    const order = await this.ordersService.createOrder(createOrderDto);
    return plainToInstance<CreateOrderResponse, CreateOrderResponse>(
      CreateOrderResponse,
      {
        data: {
          ...order.getProps(),
        },
      },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async getOrder(@Param('id') id: string): Promise<GetOrderResponseDto> {
    const order = await this.ordersService.getOrderById(id);
    return plainToInstance<CreateOrderResponse, CreateOrderResponse>(
      CreateOrderResponse,
      {
        data: {
          ...order.getProps(),
        },
      },
    );
  }

  @Get()
  async getOrders(
    @Query() queryDto: GetOrdersQueryRequest,
  ): Promise<GetOrdersResponse> {
    const orders = await this.ordersService.getOrders(queryDto);
    return plainToInstance<GetOrdersResponse, GetOrdersResponse>(
      GetOrdersResponse,
      {
        data: orders.map((order) => ({
          ...order.getProps(),
        })),
      },
    );
  }
}
