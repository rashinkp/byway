import { RetryOrderResponseDTO } from "../../../dtos/order.dto";


export interface IRetryOrderUseCase {
  execute(userId: string, orderId: string): Promise<RetryOrderResponseDTO>;
} 