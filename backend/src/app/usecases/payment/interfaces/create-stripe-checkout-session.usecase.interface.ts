import { CreateCheckoutSessionDto } from "../../../dtos/payment.dto";

interface ServiceResponse<T> {
  data: T;
  message: string;
}

export interface ICreateStripeCheckoutSessionUseCase {
  execute(
    userId: string,
    orderId: string,
    input: CreateCheckoutSessionDto
  ): Promise<
    ServiceResponse<{
      session: {
        id: string;
        url: string;
        payment_status: string;
        amount_total: number;
      };
    }>
  >;
}
