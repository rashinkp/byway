import { IHandleWebhookUseCase, IWebhookInput, WebhookResponse } from "../interfaces/handle-webhook.usecase.interface";
import { WebhookGateway } from "../../../providers/webhook-gateway.interface";
import { IPaymentService } from "../../../services/payment/interfaces/payment.service.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";

export class HandleWebhookUseCase implements IHandleWebhookUseCase {
  constructor(
    private readonly webhookGateway: WebhookGateway,
    private readonly paymentService: IPaymentService
  ) {}

  async execute(input: IWebhookInput): Promise<WebhookResponse> {
    // Verify webhook signature
    const event = await this.webhookGateway.verifySignature(input.event, input.signature);
    if (!event) {
      throw new HttpError("Invalid webhook signature", StatusCodes.UNAUTHORIZED);
    }

    // Handle different event types
    if (this.webhookGateway.isCheckoutSessionCompleted(event)) {
      return this.paymentService.handleStripeWebhook(event);
    } else if (event.type === "checkout.session.expired") {
      return {
        data: {
          status: "expired",
          message: "Checkout session expired"
        },
        message: "Checkout session expired"
      };
    }

    throw new HttpError("Unhandled webhook event type", StatusCodes.BAD_REQUEST);
  }
}
