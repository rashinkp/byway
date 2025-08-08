
import { Order } from "../../../../domain/entities/order.entity";
import { CreateOrderDto } from "../../../dtos/order.dto";
import { ITransactionOutputDTO } from "../../../dtos/transaction.dto";

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
