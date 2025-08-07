import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { BaseController } from "./base.controller";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { IPaymentService } from "../../../app/services/payment/interfaces/payment.service.interface";
import { createCheckoutSessionSchema } from "../../../app/dtos/stripe/create-checkout-session.dto";
import { StripeWebhookGateway } from "../../../infra/providers/stripe/stripe-webhook.gateway";
import { IGetEnrollmentStatsUseCase } from "@/app/usecases/enrollment/interfaces/get-enrollment-stats.usecase.interface";

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
      console.log("=== Webhook Controller ===");
      console.log("Request Body:", request.body);
      console.log("Request Headers:", request.headers);

      const signature = request.headers?.["stripe-signature"];
      if (!signature) {
        throw new Error("No signature found");
      }


      const event = await this.webhookGateway.verifySignature(
        request.body,
        signature
      );


       const session = event.data.object;
       const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;
      
       if (!userId || !courseId) {
         throw new Error("Missing Stripe metadata: userId or courseId");
       }

       const isEnrolled = await this.getEnrollmentStatsUseCase.execute({
         userId,
         courseId,
       });

       if (isEnrolled) {
         console.log(`⚠️ User ${userId} already enrolled in ${courseId}`);
         return this.success_200(null, "Already enrolled");
       }

      const response = await this.paymentService.handleStripeWebhook(event);
      return this.success_200(response.data, response.message);
    });
  }
}
