import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { createCheckoutSessionSchema } from "../../../app/dtos/payment.dto";
import { StripeWebhookGateway } from "../../../infra/providers/stripe/stripe-webhook.gateway";
import { IGetEnrollmentStatsUseCase } from "../../../app/usecases/enrollment/interfaces/get-enrollment-stats.usecase.interface";
import { ICheckoutLockProvider } from "../../../app/providers/checkout-lock.interface";
import { ICreateStripeCheckoutSessionUseCase } from "../../../app/usecases/payment/interfaces/create-stripe-checkout-session.usecase.interface";
import { IHandleWalletPaymentUseCase } from "../../../app/usecases/payment/interfaces/handle-wallet-payment.usecase.interface";
import { IHandleStripeWebhookUseCase } from "../../../app/usecases/payment/interfaces/handle-stripe-webhook.usecase.interface";

export class StripeController extends BaseController {
  private _webhookGateway: StripeWebhookGateway;

  constructor(
    private _paymentService: {
      handleWalletPayment: IHandleWalletPaymentUseCase["execute"];
      createStripeCheckoutSession: ICreateStripeCheckoutSessionUseCase["execute"];
      handleStripeWebhook: IHandleStripeWebhookUseCase["execute"];
    },
    private _getEnrollmentStatsUseCase: IGetEnrollmentStatsUseCase,
    private _checkoutLockProvider: ICheckoutLockProvider,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
    this._webhookGateway = new StripeWebhookGateway();
  }

  async createCheckoutSession(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validatedData = createCheckoutSessionSchema.parse(request.body);
      const response = await this._paymentService.createStripeCheckoutSession(
        request.user.id,
        validatedData.orderId!,
        validatedData
      );

      return this.success_200(
        response.data,
        "Checkout session created successfully"
      );
    });
  }

  async handleWebhook(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      try {
        console.log("Webhook received:", {
          headers: request.headers,
          bodyLength: request.body ? (typeof request.body === 'string' ? request.body.length : JSON.stringify(request.body).length) : 0
        });

        const signature = request.headers?.["stripe-signature"] as string;
        if (!signature) {
          console.error("No Stripe signature found in headers");
          throw new Error("No signature found");
        }

        console.log("Verifying webhook signature...");
        const event = await this._webhookGateway.verifySignature(
          request.body as unknown as string | Buffer,
          signature
        );

        console.log("Webhook event verified:", { type: event.type });

        const response = await this._paymentService.handleStripeWebhook(event);
        console.log("Webhook processed successfully:", response.message);
        console.log("Webhook response data:", response.data);
        
        return this.success_200(response.data, response.message);
      } catch (error) {
        console.error("Webhook processing error:", error);
        throw error;
      }
    });
  }

  async releaseCheckoutLock(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      this._checkoutLockProvider.unlockByUser(request.user.id);
      return this.success_200({ released: true }, "Checkout lock released");
    });
  }
}
