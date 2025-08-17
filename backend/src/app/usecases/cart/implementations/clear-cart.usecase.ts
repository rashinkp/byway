import { ICartRepository } from "../../../repositories/cart.repository";
import { IClearCartUseCase } from "../interfaces/clear-cart.usecase.interface";

export class ClearCartUseCase implements IClearCartUseCase {
  constructor(private _cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<void> {
    await this._cartRepository.clearUserCart(userId);
  }
} 