import { CartResponseDTO, GetCartDto } from "../../../dtos/cart.dto";

export interface IGetCartUseCase {
  execute(userId: string, data: GetCartDto): Promise<CartResponseDTO[]>;
}
