import { ICartRepository } from "../../../repositories/cart.repository";
import { RemoveFromCartDto } from "../../../dtos/cart.dto";
import { IRemoveFromCartUseCase } from "../interfaces/remove-from-cart.usecase.interface";
import { CartItemNotFoundError } from "../../../../domain/errors/domain-errors";

export class RemoveFromCartUseCase implements IRemoveFromCartUseCase {
  constructor(private _cartRepository: ICartRepository) {}

  async execute(userId: string, data: RemoveFromCartDto): Promise<void> {
    const cart = await this._cartRepository.findByUserAndCourse(
      userId,
      data.courseId
    );

    if (!cart) {
      throw new CartItemNotFoundError("Course not found in cart");
    }

    await this._cartRepository.delete(cart.id);
  }
}
