
import { CreateOrderDto, CreateOrderResponseDTO } from "../../../dtos/order.dto";



export interface ICreateOrderUseCase {
  execute(userId: string, input: CreateOrderDto): Promise<CreateOrderResponseDTO>;
}
