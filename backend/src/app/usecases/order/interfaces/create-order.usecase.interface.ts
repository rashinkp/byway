import { CreateOrderDto } from "../../../../domain/dtos/order/create-order.dto";
import { Order } from "../../../../domain/entities/order.entity";
import { ITransactionOutputDTO } from "../../../../domain/dtos/transaction/transaction.dto";

export interface CreateOrderResponse {
  order: Order;
  transaction?: ITransactionOutputDTO;
  session?: {
    id: string;
    url: string;
    payment_status: string;
    amount_total: number;
  };
}

export interface ICreateOrderUseCase {
  execute(userId: string, input: CreateOrderDto): Promise<CreateOrderResponse>;
} 