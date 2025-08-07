import { CheckoutSessionInput, CheckoutSessionRecord } from "../records/checkout-session.records";

export interface ICheckoutSessionRepository {
  create(session: CheckoutSessionInput): Promise<CheckoutSessionRecord>;
  findById(id: string): Promise<CheckoutSessionRecord | null>;
  findByUserId(userId: string): Promise<CheckoutSessionRecord[]>;
  findByCourseId(courseId: string): Promise<CheckoutSessionRecord[]>;
  findBySessionId(sessionId: string): Promise<CheckoutSessionRecord | null>;
  update(session: CheckoutSessionInput): Promise<CheckoutSessionRecord>;
  deleteById(id: string): Promise<void>;
  findAnyPendingSessionForUserAndCourses(
    userId: string,
    courseIds: string[]
  ): Promise<Boolean>;
}