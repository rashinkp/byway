import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { CartRepository } from "./cart.repository";
import {
  ICart,
  ICreateCartInput,
  IGetCartInput,
  IRemoveCartItemInput,
  IClearCartInput,
} from "./cart.types";

import { UserService } from "../user/user.service";
import { Role } from "@prisma/client";
import { CourseService } from "../course/course.service"; // Assuming CourseService exists
import { clearCartSchema, createCartSchema, getCartSchema, removeCartItemSchema } from "./cart.validations";

export class CartService {
  constructor(
    private cartRepository: CartRepository,
    private userService: UserService,
    private courseService: CourseService
  ) {}

  async createCart(input: ICreateCartInput): Promise<ICart> {
    const parsedInput = createCartSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for createCart", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { userId, courseId } = parsedInput.data;

    // Validate user exists
    const user = await this.userService.findUserById(userId);
    if (!user) {
      logger.warn("User not found for cart creation", { userId });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }

    // Validate course exists and is published
    const course = await this.courseService.getCourseById(courseId); // Assuming CourseService has this method
    if (!course || course.status !== "PUBLISHED") {
      logger.warn("Course not found or not published", { courseId });
      throw new AppError(
        "Course not found or not available",
        StatusCodes.NOT_FOUND,
        "NOT_FOUND"
      );
    }

    // Check for existing cart item
    const existingCartItem = await this.cartRepository.getCartItemByCourseId(
      userId,
      courseId
    );
    if (existingCartItem && !existingCartItem.deletedAt) {
      logger.warn("Course already in cart", { userId, courseId });
      throw new AppError(
        "Course is already in your cart",
        StatusCodes.BAD_REQUEST,
        "ALREADY_EXISTS"
      );
    }

    try {
      return await this.cartRepository.createCart(parsedInput.data);
    } catch (error) {
      logger.error("Error creating cart item", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to add course to cart",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getCart(
    input: IGetCartInput
  ): Promise<{ cartItems: ICart[]; total: number }> {
    const parsedInput = getCartSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for getCart", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      return await this.cartRepository.getCart(parsedInput.data);
    } catch (error) {
      logger.error("Error retrieving cart", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to retrieve cart",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async removeCartItem(input: IRemoveCartItemInput): Promise<ICart> {
    const parsedInput = removeCartItemSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for removeCartItem", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { userId, courseId } = parsedInput.data;

    try {
      const cartItem = await this.cartRepository.getCartItemByCourseId(
        userId,
        courseId
      );
      if (!cartItem) {
        logger.warn("Cart item not found", { userId, courseId });
        throw new AppError(
          "Course not found in cart",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      if (cartItem.deletedAt) {
        logger.warn("Cart item is already deleted", { userId, courseId });
        throw new AppError(
          "Course is already removed from cart",
          StatusCodes.BAD_REQUEST,
          "ALREADY_DELETED"
        );
      }
      return await this.cartRepository.removeCartItem(parsedInput.data);
    } catch (error) {
      logger.error("Error removing cart item", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to remove course from cart",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async clearCart(input: IClearCartInput): Promise<void> {
    const parsedInput = clearCartSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for clearCart", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      await this.cartRepository.clearCart(parsedInput.data);
    } catch (error) {
      logger.error("Error clearing cart", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to clear cart",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}
