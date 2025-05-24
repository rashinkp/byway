import { Cart } from "../../../../domain/entities/cart.entity";
import { ICartRepository } from "../../../repositories/cart.repository";
import { AddToCartDto } from "../../../../domain/dtos/cart/cart.dto";
import { IAddToCartUseCase } from "../interfaces/add-to-cart.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";

export class AddToCartUseCase implements IAddToCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(userId: string, data: AddToCartDto): Promise<Cart> {
    // Check if course is already in cart
    const existingCart = await this.cartRepository.findByUserAndCourse(
      userId,
      data.courseId
    );

    if (existingCart) {
      throw new HttpError("Course already in cart", 400);
    }

    // Create new cart item
    const cart = Cart.create({
      userId,
      courseId: data.courseId,
      couponId: data.couponId,
    });

    // Save to database
    return this.cartRepository.create(cart);
  }
} 