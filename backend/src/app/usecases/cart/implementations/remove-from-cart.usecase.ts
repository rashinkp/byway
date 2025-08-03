import { ICartRepository } from "../../../repositories/cart.repository";
import { RemoveFromCartDto } from "../../../dtos/cart/cart.dto";
import { IRemoveFromCartUseCase } from "../interfaces/remove-from-cart.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";

export class RemoveFromCartUseCase implements IRemoveFromCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(userId: string, data: RemoveFromCartDto): Promise<void> {
    const cart = await this.cartRepository.findByUserAndCourse(
      userId,
      data.courseId
    );

    if (!cart) {
      throw new HttpError("Course not found in cart", 404);
    }

    await this.cartRepository.delete(cart.id);
  }
}
