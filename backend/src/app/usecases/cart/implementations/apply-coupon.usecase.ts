import { Cart } from "../../../../domain/entities/cart.entity";
import { ICartRepository } from "../../../repositories/cart.repository";
import { ApplyCouponDto, CartResponseDTO } from "../../../dtos/cart.dto";
import { IApplyCouponUseCase } from "../interfaces/apply-coupon.usecase.interface";
import { CartItemNotFoundError } from "../../../../domain/errors/domain-errors";

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
      throw new CartItemNotFoundError("Course not found in cart");
    }

    cart.applyCoupon(data.couponId);
    const updatedCart = await this._cartRepository.update(cart);
    
    // Convert Cart entity to DTO
    const cartData = updatedCart.toJSON();
    
    return {
      ...cartData,
      course: updatedCart.course ? {
        id: updatedCart.course.id,
        title: updatedCart.course.title,
        description: updatedCart.course.description,
        thumbnail: updatedCart.course.thumbnail,
        price: updatedCart.course.price?.getValue() ? Number(updatedCart.course.price.getValue()) : null,
        offer: updatedCart.course.offer?.getValue() ? Number(updatedCart.course.offer.getValue()) : null,
        duration: updatedCart.course.duration?.getValue() ?? null,
        level: updatedCart.course.level,
        lessons: updatedCart.course.lessons,
        rating: updatedCart.course.rating,
        reviewCount: updatedCart.course.reviewCount,
        bestSeller: updatedCart.course.bestSeller,
      } : undefined,
    };
  }
}
