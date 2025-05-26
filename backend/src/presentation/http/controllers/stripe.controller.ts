import { ICreateCheckoutSessionUseCase } from "../../../app/usecases/stripe/interfaces/create-checkout-session.usecase.interface";
import { IHandleWebhookUseCase } from "../../../app/usecases/stripe/interfaces/handle-webhook.usecase.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { BaseController } from "./base.controller";
import { createCheckoutSessionSchema } from "../../../domain/dtos/stripe/create-checkout-session.dto";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";


export class StripeController extends BaseController {
  constructor(
    private createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase,
    private handleWebhookUseCase: IHandleWebhookUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createCheckoutSession(request: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(request, async (req) => {
      if (!req.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }

      
      const validatedData = createCheckoutSessionSchema.parse(req.body);

      const response = await this.createCheckoutSessionUseCase.execute(validatedData);
      return this.success_201(response.data, response.message);
    });
  }

  async handleWebhook(request: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(request, async (req) => {
      if (!req.headers?.["stripe-signature"]) {
        throw new BadRequestError("Missing stripe-signature header");
      }
      const response = await this.handleWebhookUseCase.execute({
        event: req.body,
        signature: req.headers["stripe-signature"],
      });
      return this.success_200(response.data, response.message);
    });
  }
} 