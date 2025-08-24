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
import { IEnrollmentRepository } from "../../../app/repositories/enrollment.repository.interface";

export class StripeController extends BaseController {
  private _webhookGateway: StripeWebhookGateway;

  constructor(
    private _paymentService: IPaymentService,
    private _getEnrollmentStatsUseCase: IGetEnrollmentStatsUseCase,
    private _enrollmentRepository: IEnrollmentRepository,
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

        const session = event.data.object;
        const userId = session.metadata?.userId;
        const courseIds = session.metadata?.courseIds;
        const isWalletTopUp = session.metadata?.isWalletTopUp === 'true';

        console.log("Webhook metadata:", { userId, courseIds, isWalletTopUp, metadata: session.metadata });

        if (!userId) {
          console.error("Missing required metadata in webhook");
          throw new Error("Missing Stripe metadata: userId");
        }

        // Handle wallet top-up
        if (isWalletTopUp) {
          console.log("Processing wallet top-up webhook...");
          const response = await this._paymentService.handleStripeWebhook(event);
          console.log("Wallet top-up processed successfully:", response.message);
          return this.success_200(response.data, response.message);
        }

        // Handle course purchase
        if (!courseIds) {
          console.error("Missing courseIds for course purchase");
          throw new Error("Missing Stripe metadata: courseIds for course purchase");
        }

        // Parse courseIds from JSON string
        let parsedCourseIds: string[];
        try {
          parsedCourseIds = JSON.parse(courseIds);
        } catch (error) {
          console.error("Invalid courseIds format in metadata:", courseIds);
          throw new Error("Invalid courseIds format in metadata");
        }

        // Check if user is already enrolled in any of the courses
        const existingEnrollments = await this._enrollmentRepository.findByUserIdAndCourseIds(userId, parsedCourseIds);
        
        if (existingEnrollments && existingEnrollments.length > 0) {
          console.log("User already enrolled in one or more courses, skipping enrollment");
          return this.success_200(null, "Already enrolled in one or more courses");
        }

        console.log("Processing webhook payment...");
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
}
