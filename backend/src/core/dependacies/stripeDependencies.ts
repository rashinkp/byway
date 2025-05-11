import { IDatabaseProvider } from "../database";
import { StripeController } from "../../modules/stripe/stripe.controller";
import { StripeService } from "../../modules/stripe/stripe.service";
import { UserService } from "../../modules/user/user.service";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { OrderService } from "../../modules/order/order.service";

export interface StripeDependencies {
  stripeController: StripeController;
  stripeService: StripeService;
}

export const initializeStripeDependencies = (
  dbProvider: IDatabaseProvider,
  userService: UserService,
  orderService:OrderService,
): StripeDependencies => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new AppError(
      "STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables are not set",
      StatusCodes.INTERNAL_SERVER_ERROR,
      "CONFIG_ERROR"
    );
  }

  // Note: Repository is optional and can be added later for DB integration
  // const prisma = dbProvider.getClient();
  // const stripeRepository = new StripeRepository(prisma);

  const stripeService = new StripeService(userService , orderService);
  const stripeController = new StripeController(stripeService);

  return { stripeController, stripeService };
};
