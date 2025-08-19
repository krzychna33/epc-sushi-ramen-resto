import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@orders/Order';
import { OrderDto } from '@orders/dto/order.dto';

export class GetOrdersQueryRequest {
  @IsOptional()
  @IsEnum(OrderStatus)
  public status?: OrderStatus;
}

export class GetOrdersResponse {
  public data!: OrderDto[];
}
