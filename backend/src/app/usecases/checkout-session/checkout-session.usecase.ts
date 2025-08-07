import { ICheckoutSessionRepository } from "../../../app/repositories/checkout-session.repository";
import { ICheckoutSessionUseCases } from "./checkout-session.usecase.interface";
import { CheckoutSessionInput } from "../../../app/records/checkout-session.records";
import { CheckoutSessionStatus } from "../../../domain/enum/checkout-session.enum";
import { HttpError } from "../../../presentation/http/errors/http-error";


export class CheckoutSessionUseCases implements ICheckoutSessionUseCases {
  constructor(
    private checkoutSessionRepo: ICheckoutSessionRepository,
  ) { }

  // 1. Create checkout session only if none pending exists
  async createCheckoutSession(input: CheckoutSessionInput) {

    const { courseId, userId } = input;
    const existing = await this.checkoutSessionRepo.findByUserId(userId);
    const hasPending = existing.some(
      (sess) => sess.courseId === courseId && sess.status === CheckoutSessionStatus.PENDING
    );
    if (hasPending) {
      throw new HttpError(
        "There is already a pending payment session for this course.",
        409
      );
    }


    const newSessionData = {
      sessionId: "stripe_session_id_mock", // from Stripe
      userId,
      courseId,
      status: CheckoutSessionStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const record = await this.checkoutSessionRepo.create(newSessionData);
    return record;
  }

  // 2. Get checkout session by sessionId
  async getCheckoutSessionById(sessionId: string) {
    const session = await this.checkoutSessionRepo.findById(sessionId);
    if (!session) {
      throw new HttpError("Checkout session not found", 404);
    }
    return session;
  }

  // 3. Update checkout session status
  async updateCheckoutSessionStatus(
    sessionId: string,
    status: CheckoutSessionStatus
  ) {
    // Find record by sessionId or id depending on your storage
    const session = await this.checkoutSessionRepo.findById(sessionId);
    if (!session) {
      throw new HttpError("Checkout session not found", 404);
    }

    // Update status
    session.status = status;
    session.updatedAt = new Date();

    const updated = await this.checkoutSessionRepo.update(session);
    return updated;
  }

  // 4. Delete checkout session
  async deleteCheckoutSessionById(sessionId: string) {
    // Validate existence if needed
    const session = await this.checkoutSessionRepo.findById(sessionId);
    if (!session) {
      throw new HttpError("Checkout session not found", 404);
    }

    await this.checkoutSessionRepo.deleteById(sessionId);
  }
}
