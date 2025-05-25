import { CreateCheckoutSessionDto } from "../../../../domain/dtos/stripe/create-checkout-session.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";

export interface ICreateCheckoutSessionUseCase {
  execute(input: CreateCheckoutSessionDto): Promise<ApiResponse>;
} 