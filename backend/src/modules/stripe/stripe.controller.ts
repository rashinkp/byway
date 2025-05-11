import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { StripeService } from "./stripe.service";
import { ICreateCheckoutSessionInput, IWebhookInput } from "./stripe.types";
import { ApiResponse } from "../../types/response";

export class StripeController {
  constructor(private stripeService: StripeService) {}

  async createCheckoutSession(
    input: ICreateCheckoutSessionInput
  ): Promise<ApiResponse> {
    try {
      logger.debug("Creating checkout session", { input });
      return await this.stripeService.createCheckoutSession(input);
    } catch (error) {
      logger.error("Error in createCheckoutSession controller", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create checkout session",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async handleWebhook(input: IWebhookInput): Promise<ApiResponse> {
    try {
      logger.debug("Handling webhook", {
        event: input.event,
      });
      return await this.stripeService.handleWebhook(input);
    } catch (error) {
      logger.error("Error in handleWebhook controller", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to process webhook",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}
