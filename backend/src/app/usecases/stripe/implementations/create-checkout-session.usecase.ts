import { ICreateCheckoutSessionUseCase } from "../interfaces/create-checkout-session.usecase.interface";
import { CreateCheckoutSessionDto } from "../../../../domain/dtos/stripe/create-checkout-session.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IUserRepository } from "../../../repositories/user.repository";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";

export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
  private stripe: Stripe;

  constructor(
    private userRepository: IUserRepository,
    private orderRepository: IOrderRepository,
    private enrollmentRepository: IEnrollmentRepository,
    private cartRepository: ICartRepository
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

    // Check if user is already enrolled in any of the courses
    const courseIds = courses.map(course => course.id);
    const existingEnrollments = await this.enrollmentRepository.findByUserIdAndCourseIds(userId, courseIds);
    
    if (existingEnrollments.length > 0) {
      const enrolledCourseIds = existingEnrollments.map((enrollment: { courseId: string }) => enrollment.courseId);
      const enrolledCourses = courses.filter(course => enrolledCourseIds.includes(course.id));
      const courseTitles = enrolledCourses.map(course => course.title).join(", ");
      
      throw new HttpError(
        `You are already enrolled in the following courses: ${courseTitles}`,
        StatusCodes.BAD_REQUEST
      );
    }

    // Create pending order
    const order = await this.orderRepository.createOrder(userId, courses, couponCode);

    // Remove courses from cart after order creation
    for (const course of courses) {
      await this.cartRepository.deleteByUserAndCourse(userId, course.id);
    }

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