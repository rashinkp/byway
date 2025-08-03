import { Cart } from "../../../../domain/entities/cart.entity";
import { ICartRepository } from "../../../repositories/cart.repository";
import { GetCartDto } from "../../../dtos/cart/cart.dto";
import { IGetCartUseCase } from "../interfaces/get-cart.usecase.interface";

export class GetCartUseCase implements IGetCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(userId: string, data: GetCartDto): Promise<Cart[]> {
    return this.cartRepository.findByUserId(userId, data.includeDeleted);
  }
}
