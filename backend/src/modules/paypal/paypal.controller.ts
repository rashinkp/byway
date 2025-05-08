import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { PaypalService } from "./paypal.service";
import { ICreateOrderInput, ICaptureOrderInput } from "./paypal.types";
import { ApiResponse } from "../../types/response";

export class PaypalController {
  constructor(private paypalService: PaypalService) {}

  async createOrder(input: ICreateOrderInput): Promise<ApiResponse> {
    try {
      return await this.paypalService.createOrder(input);
    } catch (error) {
      logger.error("Error in createOrder controller", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create order",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async captureOrder(input: ICaptureOrderInput): Promise<ApiResponse> {
    try {
      return await this.paypalService.captureOrder(input);
    } catch (error) {
      logger.error("Error in captureOrder controller", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to capture order",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}
