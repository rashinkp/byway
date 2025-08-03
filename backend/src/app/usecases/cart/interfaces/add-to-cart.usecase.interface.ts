import { Cart } from "../../../../domain/entities/cart.entity";
import { AddToCartDto } from "../../../dtos/cart/cart.dto";

export interface IAddToCartUseCase {
  execute(userId: string, data: AddToCartDto): Promise<Cart>;
}
