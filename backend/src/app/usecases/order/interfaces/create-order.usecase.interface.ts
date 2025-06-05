import { CreateOrderDto } from "../../../../domain/dtos/order/create-order.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";

export interface ICreateOrderUseCase {
  execute(userId: string, input: CreateOrderDto): Promise<ApiResponse>;
} 