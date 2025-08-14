
import { GetAllOrdersDto, OrdersResponseDto } from "../../../dtos/order.dto";

export interface IGetAllOrdersUseCase {
  execute(
    userId: string,
    filters: GetAllOrdersDto
  ): Promise<OrdersResponseDto>;
}
