import { ICartRepository } from "../../../repositories/cart.repository";
import { RemoveFromCartDto } from "../../../dtos/cart.dto";
import { IRemoveFromCartUseCase } from "../interfaces/remove-from-cart.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";

export class RemoveFromCartUseCase implements IRemoveFromCartUseCase {
  constructor(private _cartRepository: ICartRepository) {}

  async execute(userId: string, data: RemoveFromCartDto): Promise<void> {
    const cart = await this._cartRepository.findByUserAndCourse(
      userId,
      data.courseId
    );

    if (!cart) {
      throw new HttpError("Course not found in cart", 404);
    }

    await this._cartRepository.delete(cart.id);
  }
}
