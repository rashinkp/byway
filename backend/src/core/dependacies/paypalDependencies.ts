


import { IDatabaseProvider } from "../database";
import { PaypalController } from "../../modules/paypal/paypal.controller";
import { PaypalService } from "../../modules/paypal/paypal.service";
import { UserService } from "../../modules/user/user.service";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";

export interface PaypalDependencies {
  paypalController: PaypalController;
  paypalService: PaypalService;
}

export const initializePaypalDependencies = (
  dbProvider: IDatabaseProvider,
  userService: UserService
): PaypalDependencies => {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new AppError(
      "PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables are not set",
      StatusCodes.INTERNAL_SERVER_ERROR,
      "CONFIG_ERROR"
    );
  }

  // Note: Repository is optional and can be added later for DB integration
  // const prisma = dbProvider.getClient();
  // const paypalRepository = new PaypalRepository(prisma);

  const paypalService = new PaypalService(userService);
  const paypalController = new PaypalController(paypalService);

  return { paypalController, paypalService };
};