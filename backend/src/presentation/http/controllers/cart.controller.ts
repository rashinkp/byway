import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IAddToCartUseCase } from "../../../app/usecases/cart/interfaces/add-to-cart.usecase.interface";
import { IGetCartUseCase } from "../../../app/usecases/cart/interfaces/get-cart.usecase.interface";
import { IRemoveFromCartUseCase } from "../../../app/usecases/cart/interfaces/remove-from-cart.usecase.interface";
import { IApplyCouponUseCase } from "../../../app/usecases/cart/interfaces/apply-coupon.usecase.interface";
import { IClearCartUseCase } from "../../../app/usecases/cart/interfaces/clear-cart.usecase.interface";
import { HttpError } from "../errors/http-error";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import {
  validateAddToCart,
  validateApplyCoupon,
  validateGetCart,
} from "../../../presentation/validators/cart.validators";

export class CartController extends BaseController {
  constructor(
    private addToCartUseCase: IAddToCartUseCase,
    private getCartUseCase: IGetCartUseCase,
    private removeFromCartUseCase: IRemoveFromCartUseCase,
    private applyCouponUseCase: IApplyCouponUseCase,
    private clearCartUseCase: IClearCartUseCase,
    protected httpErrors: IHttpErrors,
    protected httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async addToCart(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validated = validateAddToCart(request.body);
      const cart = await this.addToCartUseCase.execute(
        request.user.id,
        validated
      );

      return this.success_201(cart, "Course added to cart successfully");
    });
  }

  async getCart(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validated = validateGetCart(request.query);
      const cart = await this.getCartUseCase.execute(
        request.user.id,
        validated
      );

      // Format cart items to include course data
      const formattedCart = cart.map((item) => ({
        ...item,
        course: item.course
          ? {
              id: item.course.id,
              title: item.course.title,
              description: item.course.description,
              thumbnail: item.course.thumbnail,
              price: item.course.price?.getValue() ?? null,
              offer: item.course.offer?.getValue() ?? null,
              duration: item.course.duration?.getValue() ?? null,
              level: item.course.level,
              lessons: item.course.lessons,
              rating: item.course.rating,
              reviewCount: item.course.reviewCount,
              bestSeller: item.course.bestSeller,
            }
          : undefined,
      }));

      return this.success_200(
        {
          cartItems: formattedCart,
          total: cart.length,
        },
        "Cart retrieved successfully"
      );
    });
  }

  async removeFromCart(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const courseId = request.params?.courseId;
      if (!courseId) {
        throw new HttpError("Course ID is required", 400);
      }

      await this.removeFromCartUseCase.execute(request.user.id, { courseId });

      return this.success_200(null, "Course removed from cart successfully");
    });
  }

  async applyCoupon(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validated = validateApplyCoupon(request.body);
      const cart = await this.applyCouponUseCase.execute(
        request.user.id,
        validated
      );

      return this.success_200(cart, "Coupon applied successfully");
    });
  }

  async clearCart(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      await this.clearCartUseCase.execute(request.user.id);
      return this.success_200(null, "Cart cleared successfully");
    });
  }
}
