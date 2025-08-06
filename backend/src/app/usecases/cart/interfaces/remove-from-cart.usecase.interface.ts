import { RemoveFromCartDto } from "../../../dtos/cart.dto";

export interface IRemoveFromCartUseCase {
  execute(userId: string, data: RemoveFromCartDto): Promise<void>;
}
