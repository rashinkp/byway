import { ICreateStripeCheckoutSessionUseCase } from "../interfaces/create-stripe-checkout-session.usecase.interface";
import { CreateCheckoutSessionDto } from "../../../dtos/payment.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { IUserRepository } from "../../../repositories/user.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { PaymentGateway } from "../../../providers/payment-gateway.interface";

interface ServiceResponse<T> {
  data: T;
  message: string;
}

export class CreateStripeCheckoutSessionUseCase implements ICreateStripeCheckoutSessionUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _paymentGateway: PaymentGateway
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
      throw new HttpError("User not found", StatusCodes.NOT_FOUND);
    }

    const courseIds = input.courses?.map((c) => c.id) || [];
    const isEnrolled =
      await this._enrollmentRepository.findByUserIdAndCourseIds(
        userId,
        courseIds
      );

    if (isEnrolled && isEnrolled.length > 0) {
      throw new HttpError("User already enrolled in this course", 400);
    }

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
