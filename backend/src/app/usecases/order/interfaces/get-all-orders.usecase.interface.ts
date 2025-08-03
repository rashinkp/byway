import { Order } from "../../../../domain/entities/order.entity";
import { GetAllOrdersDto } from "../../../dtos/order/order.dto";

export interface IGetAllOrdersUseCase {
  execute(
    userId: string,
    filters: GetAllOrdersDto
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
