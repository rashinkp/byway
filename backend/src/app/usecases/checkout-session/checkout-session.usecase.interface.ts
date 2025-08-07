import { CheckoutSessionInput, CheckoutSessionRecord } from "@/app/records/checkout-session.records";
import { CheckoutSessionStatus } from "@/domain/enum/checkout-session.enum";

export interface ICheckoutSessionUseCases {
  createCheckoutSession(
    input: CheckoutSessionInput
  ): Promise<CheckoutSessionRecord>;

  // 2. Retrieve checkout session by ID
  getCheckoutSessionById(
    sessionId: string
  ): Promise<CheckoutSessionRecord | null>;

  updateCheckoutSessionStatus(
    sessionId: string,
    status: CheckoutSessionStatus
  ): Promise<CheckoutSessionRecord>;

  deleteCheckoutSessionById(sessionId: string): Promise<void>;
}
