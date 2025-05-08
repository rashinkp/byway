import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import paypal from "@paypal/checkout-server-sdk";
import { UserService } from "../user/user.service";
import {
  ICreateOrderInput,
  ICaptureOrderInput,
  IPaypalOrderResponse,
  IPaypalCaptureResponse,
} from "./paypal.types";
import { ApiResponse } from "../../types/response";
import { captureOrderSchema, createOrderSchema } from "./paypal.validators";
import client from "../../utils/paypalClient";

export class PaypalService {
  constructor(private userService: UserService) {}

  async createOrder(input: ICreateOrderInput): Promise<ApiResponse> {
    const parsedInput = createOrderSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for createOrder", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { order_price, userId } = parsedInput.data;

    // Validate user exists
    const user = await this.userService.findUserById(userId);
    if (!user) {
      logger.warn("User not found for order creation", { userId });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }

    try {
      const PaypalClient = client();
      const request = new paypal.orders.OrdersCreateRequest();
      request.headers["Prefer"] = "return=representation";
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: order_price,
            },
          },
        ],
      });

      const response = await PaypalClient.execute(request);
      if (response.statusCode !== 201) {
        logger.error("Failed to create PayPal order", { response });
        throw new AppError(
          "Failed to create PayPal order",
          StatusCodes.INTERNAL_SERVER_ERROR,
          "PAYPAL_ERROR"
        );
      }

      const order: IPaypalOrderResponse = response.result;

      // TODO: Optionally store order in database here (via repository)

      return {
        status: "success",
        data: { order },
        message: "PayPal order created successfully",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      logger.error("Error creating PayPal order", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create PayPal order",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async captureOrder(input: ICaptureOrderInput): Promise<ApiResponse> {
    const parsedInput = captureOrderSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for captureOrder", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { orderID, userId } = parsedInput.data;

    // Validate user exists
    const user = await this.userService.findUserById(userId);
    
    if (!user) {
      logger.warn("User not found for order capture", { userId });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }

    try {
      const PaypalClient = client();
      const request = new paypal.orders.OrdersCaptureRequest(orderID);
      // Type assertion to bypass TypeScript error, as empty body is valid for OrdersCaptureRequest
      request.requestBody({} as any);

      const response = await PaypalClient.execute(request);
      if (response.statusCode !== 201 && response.statusCode !== 200) {
        logger.error("Failed to capture PayPal order", { response });
        throw new AppError(
          "Failed to capture PayPal order",
          StatusCodes.INTERNAL_SERVER_ERROR,
          "PAYPAL_ERROR"
        );
      }

      const capture: IPaypalCaptureResponse = response.result;

      // TODO: Update database here (e.g., mark order as paid, update wallet)
      // Placeholder wallet update logic
      const wallet = {
        balance: 500, // Replace with actual wallet update logic (e.g., fetch from DB)
        transactionId: capture.purchase_units[0].payments.captures[0].id,
      };

      return {
        status: "success",
        data: { wallet },
        message: "PayPal order captured successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error capturing PayPal order", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to capture PayPal order",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}
