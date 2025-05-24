import { RemoveFromCartDto } from "../../../../domain/dtos/cart/cart.dto";

export interface IRemoveFromCartUseCase {
  execute(userId: string, data: RemoveFromCartDto): Promise<void>;
} 