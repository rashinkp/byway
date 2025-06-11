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
    console.log('Webhook received:', typeof input.event);
    
    // Verify webhook signature
    const event = await this.webhookGateway.verifySignature(input.event, input.signature);
    if (!event) {
      console.error('Invalid webhook signature');
      throw new HttpError("Invalid webhook signature", StatusCodes.UNAUTHORIZED);
    }

    console.log('Webhook verified, type:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Processing completed checkout session');
        return this.paymentService.handleStripeWebhook(event);
      
      case 'payment_intent.succeeded':
      case 'charge.succeeded':
        console.log('Processing successful payment');
        return this.paymentService.handleStripeWebhook(event);
      
      case 'checkout.session.expired':
        console.log('Checkout session expired');
        return this.paymentService.handleStripeWebhook(event);
      
      case 'payment_intent.payment_failed':
      case 'charge.failed':
        console.log('Payment failed');
        return this.paymentService.handleStripeWebhook(event);
      
      case 'payment_intent.created':
        console.log('Payment intent created');
        return this.paymentService.handleStripeWebhook(event);
      
      default:
        console.log('Unhandled webhook event type:', event.type);
    return {
          data: {
            status: "ignored",
            message: "Event type not handled"
          },
          message: "Event type not handled"
        };
    }
  }
}
