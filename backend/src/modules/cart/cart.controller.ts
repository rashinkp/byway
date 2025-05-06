import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { IClearCartInput, ICreateCartInput, IGetCartInput, IRemoveCartItemInput } from "./cart.types";
import { ApiResponse } from "../../types/response";
import { CartService } from "./cart.service";

export class CartController {
  constructor(private cartService: CartService) {}

  async createCart(input: ICreateCartInput): Promise<ApiResponse> {
    try {
      const cartItem = await this.cartService.createCart(input);
      return {
        status: "success",
        data: cartItem,
        message: "Course added to cart successfully",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      logger.error("Error adding course to cart", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to add course to cart",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getCart(input: IGetCartInput): Promise<ApiResponse> {
    try {
      const result = await this.cartService.getCart(input);
      return {
        status: "success",
        data: result,
        message: "Cart retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error retrieving cart", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to retrieve cart",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async removeCartItem(input: IRemoveCartItemInput): Promise<ApiResponse> {
    try {
      const cartItem = await this.cartService.removeCartItem(input);
      return {
        status: "success",
        data: cartItem,
        message: "Course removed from cart successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error removing course from cart", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to remove course from cart",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async clearCart(input: IClearCartInput): Promise<ApiResponse> {
    try {
      await this.cartService.clearCart(input);
      return {
        status: "success",
        data: null,
        message: "Cart cleared successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error clearing cart", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to clear cart",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}

