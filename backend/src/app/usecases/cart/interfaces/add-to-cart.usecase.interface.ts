import { AddToCartDto, CartResponseDTO } from "../../../dtos/cart.dto";

export interface IAddToCartUseCase {
  execute(userId: string, data: AddToCartDto): Promise<CartResponseDTO>;
}
