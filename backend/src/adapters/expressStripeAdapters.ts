import { NextFunction, Request, Response } from "express";
import { StripeController } from "../modules/stripe/stripe.controller";
import {
  ICreateCheckoutSessionInput,
  IWebhookInput,
} from "../modules/stripe/stripe.types";
import { StatusCodes } from "http-status-codes";
import { logger } from "../utils/logger";
import { AppError } from "../utils/appError";

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

const asyncHandler = (
  fn: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
};

export const adaptStripeController = (controller: StripeController) => ({
  createCheckoutSession: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input: ICreateCheckoutSessionInput = {
        courses: req.body.courses,
        userId: req.user.id,
        couponCode: req.body.couponCode,
      };
      const result = await controller.createCheckoutSession(input);
      res.status(result.statusCode).json(result);
    }
  ),

  handleWebhook: asyncHandler(async (req: Request, res: Response) => {
    try {
      const signatureHeader = req.headers["stripe-signature"];
      if (!signatureHeader) {
        throw new AppError(
          "Missing Stripe-Signature header",
          StatusCodes.BAD_REQUEST,
          "WEBHOOK_ERROR"
        );
      }
      const signature = Array.isArray(signatureHeader)
        ? signatureHeader[0]
        : signatureHeader;

      // Debug raw body
      logger.debug("Webhook raw body type:", {
        isBuffer: Buffer.isBuffer(req.body),
        body: req.body.toString(),
      });

      // Parse raw body to JSON
      let event;
      try {
        event = JSON.parse(req.body.toString());
      } catch (e) {
        logger.error("Failed to parse webhook body", { error: e });
        throw new AppError(
          "Invalid webhook body",
          StatusCodes.BAD_REQUEST,
          "WEBHOOK_BODY_ERROR"
        );
      }

      const input: IWebhookInput = {
        event,
        signature,
      };

      const result = await controller.handleWebhook(input);
      res.status(result.statusCode).json(result);
    } catch (error) {
      logger.error("Webhook adapter error:", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to process webhook",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "WEBHOOK_ERROR"
          );
    }
  }),
});
