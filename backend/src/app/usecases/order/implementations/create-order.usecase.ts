import { ICreateOrderUseCase } from "../interfaces/create-order.usecase.interface";
import { CreateOrderDto } from "../../../../domain/dtos/order/create-order.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";
import { IUserRepository } from "../../../repositories/user.repository";
import { IOrderRepository } from "../../../repositories/order.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { Transaction } from "../../../../domain/entities/transaction.entity";

export class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    private userRepository: IUserRepository,
    private orderRepository: IOrderRepository,
    private enrollmentRepository: IEnrollmentRepository,
    private transactionRepository: ITransactionRepository,
    private walletRepository: IWalletRepository
  ) {}

  async execute(userId: string, input: CreateOrderDto): Promise<ApiResponse> {
    const { courses, paymentMethod, couponCode } = input;

    // Validate user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", StatusCodes.NOT_FOUND);
    }

    // Check if user is already enrolled in any of the courses
    const courseIds = courses.map(course => course.id);
    const existingEnrollments = await this.enrollmentRepository.findByUserIdAndCourseIds(userId, courseIds);

    if (existingEnrollments.length > 0) {
      const enrolledCourseIds = existingEnrollments.map(enrollment => enrollment.courseId);
      const enrolledCourses = courses.filter(course => enrolledCourseIds.includes(course.id));
      const courseTitles = enrolledCourses.map(course => course.title).join(", ");
      
      throw new HttpError(
        `You are already enrolled in the following courses: ${courseTitles}`,
        StatusCodes.BAD_REQUEST
      );
    }

    // Calculate total amount
    const totalAmount = courses.reduce((sum, course) => {
      const coursePrice = course.offer ?? course.price ?? 0;
      return sum + coursePrice;
    }, 0);

    // Create order
    const order = await this.orderRepository.createOrder(userId, courses, couponCode);

    // Handle wallet payment
    if (paymentMethod === "WALLET") {
      const wallet = await this.walletRepository.findByUserId(userId);
      if (!wallet) {
        throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
      }
      if (wallet.balance.amount < totalAmount) {
        throw new HttpError("Insufficient wallet balance", StatusCodes.BAD_REQUEST);
      }

      // Deduct from wallet
      wallet.reduceAmount(totalAmount);
      await this.walletRepository.update(wallet);

      // Create transaction
      const transaction = new Transaction({
        orderId: order.id,
        userId,
        amount: totalAmount,
        type: TransactionType.PURCHASE,
        status: TransactionStatus.COMPLETED,
        paymentGateway: PaymentGateway.STRIPE,
      });
      await this.transactionRepository.create(transaction);

      // Update order status
      await this.orderRepository.updateOrderStatus(
        order.id,
        "COMPLETED",
        transaction.id,
        "WALLET"
      );

      // Create enrollments
      await this.enrollmentRepository.create({
        userId,
        courseIds,
      });

      return {
        success: true,
        data: {
          order,
          transaction,
        },
        message: "Order created and paid successfully using wallet",
        statusCode: StatusCodes.CREATED,
      };
    }

    // For other payment methods, return order details for payment processing
    return {
      success: true,
      data: {
        order,
        paymentMethod,
        amount: totalAmount,
      },
      message: "Order created successfully. Proceed with payment.",
      statusCode: StatusCodes.CREATED,
    };
  }
} 