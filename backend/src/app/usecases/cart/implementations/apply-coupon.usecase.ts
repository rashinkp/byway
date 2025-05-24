import { Cart } from "../../../../domain/entities/cart.entity";
import { ICartRepository } from "../../../repositories/cart.repository";
import { ApplyCouponDto } from "../../../../domain/dtos/cart/cart.dto";
import { IApplyCouponUseCase } from "../interfaces/apply-coupon.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";

export class ApplyCouponUseCase implements IApplyCouponUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(userId: string, data: ApplyCouponDto): Promise<Cart> {
    const cart = await this.cartRepository.findByUserAndCourse(userId, data.courseId);
    
    if (!cart) {
      throw new HttpError("Course not found in cart", 404);
    }

    cart.applyCoupon(data.couponId);
    return this.cartRepository.update(cart);
  }
} 