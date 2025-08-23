import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { IPaymentService } from "../../../app/services/payment/interfaces/payment.service.interface";
import { createCheckoutSessionSchema } from "../../../app/dtos/payment.dto";
import { StripeWebhookGateway } from "../../../infra/providers/stripe/stripe-webhook.gateway";
import { IGetEnrollmentStatsUseCase } from "../../../app/usecases/enrollment/interfaces/get-enrollment-stats.usecase.interface";

export class StripeController extends BaseController {
  private webhookGateway: StripeWebhookGateway;

  constructor(
    private paymentService: IPaymentService,
    private getEnrollmentStatsUseCase: IGetEnrollmentStatsUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
    this.webhookGateway = new StripeWebhookGateway();
  }

  async createCheckoutSession(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      const validatedData = createCheckoutSessionSchema.parse(request.body);
      const response = await this.paymentService.createStripeCheckoutSession(
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
        const event = await this.webhookGateway.verifySignature(
          request.body as unknown as string | Buffer,
          signature
        );

        console.log("Webhook event verified:", { type: event.type });

        const session = event.data.object;
        const userId = session.metadata?.userId;
        const courseId = session.metadata?.courseId;

        console.log("Webhook metadata:", { userId, courseId, metadata: session.metadata });

        if (!userId || !courseId) {
          console.error("Missing required metadata in webhook");
          throw new Error("Missing Stripe metadata: userId or courseId");
        }

        const isEnrolled = await this.getEnrollmentStatsUseCase.execute({
          userId,
          courseId,
        });

        if (isEnrolled) {
          console.log("User already enrolled, skipping enrollment");
          return this.success_200(null, "Already enrolled");
        }

        console.log("Processing webhook payment...");
        const response = await this.paymentService.handleStripeWebhook(event);
        console.log("Webhook processed successfully:", response.message);
        console.log("Webhook response data:", response.data);
        
        return this.success_200(response.data, response.message);
      } catch (error) {
        console.error("Webhook processing error:", error);
        throw error;
      }
    });
  }
}
