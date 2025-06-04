import { ICreateCheckoutSessionUseCase } from "../interfaces/create-checkout-session.usecase.interface";
import { CreateCheckoutSessionDto } from "../../../../domain/dtos/stripe/create-checkout-session.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IUserRepository } from "../../../repositories/user.repository";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { PaymentGateway } from "../../../providers/payment-gateway.interface";

export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
  constructor(
    private userRepository: IUserRepository,
    private orderRepository: IOrderRepository,
    private enrollmentRepository: IEnrollmentRepository,
    private cartRepository: ICartRepository,
    private paymentGateway: PaymentGateway
  ) {}

  async execute(input: CreateCheckoutSessionDto): Promise<ApiResponse> {
    const { userId, courses, couponCode, orderId, isWalletTopUp, amount } = input;

    // Validate user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", StatusCodes.NOT_FOUND);
    }

    let orderIdForSession = orderId;

    // Handle wallet top-up
    if (isWalletTopUp) {
      if (!amount || amount <= 0) {
        throw new HttpError("Invalid amount for wallet top-up", StatusCodes.BAD_REQUEST);
      }
      // No need to create an order for wallet top-up
    } else {
      // Handle course purchase
      if (!courses) {
        throw new HttpError("Courses are required for course purchase", StatusCodes.BAD_REQUEST);
      }

      // If orderId is provided, use existing order for retry
      if (orderId) {
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
          throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
        }
        if (order.userId !== userId) {
          throw new HttpError("Unauthorized access to order", StatusCodes.FORBIDDEN);
        }
        if (order.paymentStatus !== "FAILED") {
          throw new HttpError("Can only retry failed orders", StatusCodes.BAD_REQUEST);
        }
      } else {
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

        // Create new order for course purchase
        const order = await this.orderRepository.createOrder(userId, courses, couponCode);
        orderIdForSession = order.id;

        // Remove courses from cart after order creation
        for (const course of courses) {
          await this.cartRepository.deleteByUserAndCourse(userId, course.id);
        }
      }
    }

    // Create checkout session using payment gateway
    const session = await this.paymentGateway.createCheckoutSession(
      input,
      user.email,
      orderIdForSession || "wallet-topup" // Use a placeholder for wallet top-ups
    );

    return {
      success: true,
      data: {
        session: {
          id: session.id,
          url: session.url,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
        },
      },
      message: "Checkout session created successfully",
      statusCode: StatusCodes.CREATED,
    };
  }
} 