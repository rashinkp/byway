import { ICreateStripeCheckoutSessionUseCase } from "../interfaces/create-stripe-checkout-session.usecase.interface";
import { CreateCheckoutSessionDto } from "../../../dtos/payment.dto";
import { IUserRepository } from "../../../repositories/user.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { PaymentGateway } from "../../../providers/payment-gateway.interface";
import { UserNotFoundError, BusinessRuleViolationError } from "../../../../domain/errors/domain-errors";
import { ICheckoutLockProvider } from "../../../providers/checkout-lock.interface";
import { envConfig } from "../../../../presentation/express/configs/env.config";

interface ServiceResponse<T> {
  data: T;
  message: string;
}

export class CreateStripeCheckoutSessionUseCase implements ICreateStripeCheckoutSessionUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _paymentGateway: PaymentGateway,
    private readonly _checkoutLock: ICheckoutLockProvider
  ) {}

  async execute(
    userId: string,
    orderId: string,
    input: CreateCheckoutSessionDto
  ): Promise<
    ServiceResponse<{
      session: {
        id: string;
        url: string;
        payment_status: string;
        amount_total: number;
      };
    }>
  > {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const courseIds = input.courses?.map((c) => c.id) || [];
    const isEnrolled =
      await this._enrollmentRepository.findByUserIdAndCourseIds(
        userId,
        courseIds
      );

    if (isEnrolled && isEnrolled.length > 0) {
      throw new BusinessRuleViolationError("User already enrolled in this course");
    }

    // Enforce per-user checkout lock with TTL (e.g., 15 minutes)
    const lockTtlMs = envConfig.CHECKOUT_LOCK_TTL_MS;
    if (this._checkoutLock.isLocked(userId)) {
      throw new BusinessRuleViolationError("You already have an active checkout in progress. Please complete or wait before starting a new one.");
    }

    // Acquire lock before creating session
    this._checkoutLock.lock(userId, orderId, lockTtlMs);

    const session = await this._paymentGateway.createCheckoutSession(
      {
        userId,
        courses: input.courses,
        couponCode: input.couponCode,
        orderId,
        amount: input.amount,
        isWalletTopUp: input.isWalletTopUp,
      },
      user.email,
      orderId
    );

    return {
      data: {
        session: {
          id: session.id,
          url: session.url,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
        },
      },
      message: "Stripe checkout session created successfully",
    };
  }
}
