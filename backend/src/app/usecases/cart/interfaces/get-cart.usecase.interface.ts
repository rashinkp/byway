import { Cart } from "../../../../domain/entities/cart.entity";
import { GetCartDto } from "../../../../domain/dtos/cart/cart.dto";

export interface IGetCartUseCase {
  execute(userId: string, data: GetCartDto): Promise<Cart[]>;
} 