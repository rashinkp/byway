import { Cart } from "../../../../domain/entities/cart.entity";
import { ICartRepository } from "../../../repositories/cart.repository";
import { ApplyCouponDto, CartResponseDTO } from "../../../dtos/cart.dto";
import { IApplyCouponUseCase } from "../interfaces/apply-coupon.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";

export class ApplyCouponUseCase implements IApplyCouponUseCase {
  constructor(private _cartRepository: ICartRepository) {}

  async execute(
    userId: string,
    data: ApplyCouponDto
  ): Promise<CartResponseDTO> {
    const cart = await this._cartRepository.findByUserAndCourse(
      userId,
      data.courseId
    );

    if (!cart) {
      throw new HttpError("Course not found in cart", 404);
    }

    cart.applyCoupon(data.couponId);
    return this._cartRepository.update(cart.id , cart);
  }
}
