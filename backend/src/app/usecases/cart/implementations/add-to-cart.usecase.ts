import { Cart } from "../../../../domain/entities/cart.entity";
import { ICartRepository } from "../../../repositories/cart.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { AddToCartDto, CartResponseDTO } from "../../../dtos/cart.dto";
import { IAddToCartUseCase } from "../interfaces/add-to-cart.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";

export class AddToCartUseCase implements IAddToCartUseCase {
  constructor(
    private cartRepository: ICartRepository,
    private enrollmentRepository: IEnrollmentRepository
  ) {}

  async execute(userId: string, data: AddToCartDto): Promise<CartResponseDTO> {
    // Restrict cart size
    const cartCount = await this.cartRepository.countByUserId(userId);
    const MAX_CART_ITEMS = 5;
    if (cartCount >= MAX_CART_ITEMS) {
      throw new HttpError(
        `You can only have up to ${MAX_CART_ITEMS} items in your cart.`,
        400
      );
    }

    // Check if course is already in cart
    const existingCart = await this.cartRepository.findByUserAndCourse(
      userId,
      data.courseId
    );

    if (existingCart) {
      throw new HttpError("Course already in cart", 400);
    }

    // Check if user is already enrolled in the course
    const existingEnrollment =
      await this.enrollmentRepository.findByUserAndCourse(
        userId,
        data.courseId
      );

    if (existingEnrollment) {
      throw new HttpError("You are already enrolled in this course", 400);
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
