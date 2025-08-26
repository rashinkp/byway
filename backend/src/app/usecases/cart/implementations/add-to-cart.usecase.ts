import { Cart } from "../../../../domain/entities/cart.entity";
import { ICartRepository } from "../../../repositories/cart.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { AddToCartDto, CartResponseDTO } from "../../../dtos/cart.dto";
import { IAddToCartUseCase } from "../interfaces/add-to-cart.usecase.interface";
import { mapCartToDTO } from "../utils/cart-dto-mapper";
import { CartValidationError, BusinessRuleViolationError } from "../../../../domain/errors/domain-errors";

export class AddToCartUseCase implements IAddToCartUseCase {
  constructor(
    private _cartRepository: ICartRepository,
    private _enrollmentRepository: IEnrollmentRepository
  ) {}

  async execute(userId: string, data: AddToCartDto): Promise<CartResponseDTO> {
    // Restrict cart size
    const cartCount = await this._cartRepository.countByUserId(userId);
    const MAX_CART_ITEMS = 5;
    if (cartCount >= MAX_CART_ITEMS) {
      throw new CartValidationError(
        `You can only have up to ${MAX_CART_ITEMS} items in your cart.`
      );
    }

    // Check if course is already in cart
    const existingCart = await this._cartRepository.findByUserAndCourse(
      userId,
      data.courseId
    );

    if (existingCart) {
      throw new CartValidationError("Course already in cart");
    }

    // Check if user is already enrolled in the course
    const existingEnrollment =
      await this._enrollmentRepository.findByUserAndCourse(
        userId,
        data.courseId
      );

    if (existingEnrollment) {
      throw new BusinessRuleViolationError("You are already enrolled in this course");
    }

    // Create new cart item
    const cart = Cart.create({
      userId,
      courseId: data.courseId,
      couponId: data.couponId,
    });

    // Save to database
    const createdCart = await this._cartRepository.create(cart);
    return mapCartToDTO(createdCart);
  } 
}
