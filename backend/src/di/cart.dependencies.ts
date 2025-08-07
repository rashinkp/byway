import { AddToCartUseCase } from "../app/usecases/cart/implementations/add-to-cart.usecase";
import { GetCartUseCase } from "../app/usecases/cart/implementations/get-cart.usecase";
import { RemoveFromCartUseCase } from "../app/usecases/cart/implementations/remove-from-cart.usecase";
import { ApplyCouponUseCase } from "../app/usecases/cart/implementations/apply-coupon.usecase";
import { ClearCartUseCase } from "../app/usecases/cart/implementations/clear-cart.usecase";
import { CartController } from "../presentation/http/controllers/cart.controller";
import { SharedDependencies } from "./shared.dependencies";

export interface CartDependencies {
  cartController: CartController;
}

export function createCartDependencies(
  deps: SharedDependencies
): CartDependencies {
  const { cartRepository, enrollmentRepository } = deps;

  // Initialize use cases
  const addToCartUseCase = new AddToCartUseCase(
    cartRepository,
    enrollmentRepository
  );
  const getCartUseCase = new GetCartUseCase(cartRepository);
  const removeFromCartUseCase = new RemoveFromCartUseCase(cartRepository);
  const applyCouponUseCase = new ApplyCouponUseCase(cartRepository);
  const clearCartUseCase = new ClearCartUseCase(cartRepository);

  // Initialize controller
  const cartController = new CartController(
    addToCartUseCase,
    getCartUseCase,
    removeFromCartUseCase,
    applyCouponUseCase,
    clearCartUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    cartController,
  };
}
