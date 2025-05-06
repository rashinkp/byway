import { IDatabaseProvider } from "../database";
import { CartController } from "../../modules/cart/cart.controller";
import { CartService } from "../../modules/cart/cart.service";
import { CartRepository } from "../../modules/cart/cart.repository";
import { UserService } from "../../modules/user/user.service";
import { CourseService } from "../../modules/course/course.service";

export interface CartDependencies {
  cartController: CartController;
  cartService: CartService;
}

export const initializeCartDependencies = (
  dbProvider: IDatabaseProvider,
  userService: UserService,
  courseService: CourseService
): CartDependencies => {
  const prisma = dbProvider.getClient();
  const cartRepository = new CartRepository(prisma);
  const cartService = new CartService(
    cartRepository,
    userService,
    courseService
  );
  const cartController = new CartController(cartService);

  return { cartController, cartService };
};
