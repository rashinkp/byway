import { ICreateCheckoutSessionUseCase } from "../interfaces/create-checkout-session.usecase.interface";
import { CreateCheckoutSessionDto } from "../../../../domain/dtos/stripe/create-checkout-session.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IUserRepository } from "../../../repositories/user.repository";
import { IOrderRepository } from "../../../repositories/order.repository";
import { StripeCheckout } from "../../../../domain/entities/stripe-checkout.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "../../../../domain/enum/payment-status.enum";

const mapStripePaymentStatus = (status: Stripe.Checkout.Session.PaymentStatus): PaymentStatus => {
  switch (status) {
    case 'paid':
      return PaymentStatus.COMPLETED;
    case 'unpaid':
      return PaymentStatus.PENDING;
    case 'no_payment_required':
      return PaymentStatus.COMPLETED;
    default:
      return PaymentStatus.PENDING;
  }
};

export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
  private stripe: Stripe;

  constructor(
    private userRepository: IUserRepository,
    private orderRepository: IOrderRepository
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30.basil",
    });
  }

  async execute(input: CreateCheckoutSessionDto): Promise<ApiResponse> {
    const { userId, courses, couponCode } = input;

    // Validate user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", StatusCodes.NOT_FOUND);
    }

    // Create pending order
    const order = await this.orderRepository.createOrder(userId, courses, couponCode);

    // Validate FRONTEND_URL
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      throw new HttpError(
        "Server configuration error: FRONTEND_URL is missing",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    try {
      // Create line items from course details
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = courses.map(
        (course) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description || undefined,
              images: course.thumbnail ? [course.thumbnail] : undefined,
              metadata: {
                courseId: course.id,
                ...(course.duration && { duration: course.duration }),
                ...(course.level && { level: course.level }),
              },
            },
            unit_amount: Math.round((course.offer || course.price) * 100),
          },
          quantity: 1,
        })
      );

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/cancel`,
        customer_email: user.email,
        metadata: {
          userId,
          orderId: order.id,
          courses: JSON.stringify(courses),
        },
        discounts: couponCode ? [{ coupon: couponCode }] : undefined,
      });

      // Create checkout session record
      const checkoutSession = new StripeCheckout(
        uuidv4(),
        userId,
        order.id,
        session.id,
        session.payment_intent as string,
        mapStripePaymentStatus(session.payment_status),
        session.amount_total!,
        session.currency || 'usd',
        new Date(),
        new Date()
      );

      

      return {
        success: true,
        data: {
          session: {
            id: session.id,
            url: session.url!,
            payment_status: session.payment_status,
            amount_total: session.amount_total!,
          },
        },
        message: "Stripe checkout session created successfully",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        throw new HttpError(error.message, StatusCodes.BAD_REQUEST);
      }
      throw new HttpError(
        "Failed to create Stripe checkout session",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
} 