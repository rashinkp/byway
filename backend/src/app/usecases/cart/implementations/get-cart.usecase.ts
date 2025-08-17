import { Cart } from "../../../../domain/entities/cart.entity";
import { ICartRepository } from "../../../repositories/cart.repository";
import { CartResponseDTO, GetCartDto } from "../../../dtos/cart.dto";
import { IGetCartUseCase } from "../interfaces/get-cart.usecase.interface";

export class GetCartUseCase implements IGetCartUseCase {
  constructor(private _cartRepository: ICartRepository) {}

  async execute(userId: string, data: GetCartDto): Promise<CartResponseDTO[]> {
    return this._cartRepository.findByUserId(userId, data.includeDeleted);
  }
}
