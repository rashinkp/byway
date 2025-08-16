import { IPaymentService } from "../interfaces/payment.service.interface";
import { CreateCheckoutSessionDto } from "../../../dtos/payment.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway as PaymentGatewayEnum } from "../../../../domain/enum/payment-gateway.enum";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { WebhookEvent } from "../../../../domain/value-object/webhook-event.value-object";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { IOrderRepository } from "../../../repositories/order.repository";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { PaymentGateway } from "../../../providers/payment-gateway.interface";
import { StripeWebhookGateway } from "../../../../infra/providers/stripe/stripe-webhook.gateway";
import { IUserRepository } from "../../../repositories/user.repository";
import Stripe from "stripe";
import { OrderStatus } from "../../../../domain/enum/order-status.enum";
import { IRevenueDistributionService } from "../../revenue-distribution/interfaces/revenue-distribution.service.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { getSocketIOInstance } from "../../../../presentation/socketio";
import { Order } from "../../../../domain/entities/order.entity";

interface ServiceResponse<T> {
  data: T;
  message: string;
}

export class PaymentService implements IPaymentService {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly webhookGateway: StripeWebhookGateway,
    private readonly userRepository: IUserRepository,
    private readonly revenueDistributionService: IRevenueDistributionService,
    private readonly cartRepository: ICartRepository
  ) {}

  async handleWalletPayment(
    userId: string,
    orderId: string,
    amount: number
  ): Promise<ServiceResponse<{ transaction: Transaction }>> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
    }
    if (wallet.balance.amount < amount) {
      throw new HttpError(
        "Insufficient wallet balance",
        StatusCodes.BAD_REQUEST
      );
    }

    // Deduct from wallet
    wallet.reduceAmount(amount);
    await this.walletRepository.update(wallet);

    // Create transaction
    const transaction = new Transaction({
      orderId,
      userId,
      amount,
      type: TransactionType.PURCHASE,
      status: TransactionStatus.COMPLETED,
      paymentGateway: PaymentGatewayEnum.WALLET,
    });
    await this.transactionRepository.create(transaction);

    // Update order status
    await this.orderRepository.updateOrderStatus(
      orderId,
      OrderStatus.COMPLETED,
      transaction.id,
      PaymentGatewayEnum.WALLET
    );

    // Create enrollments for each course in the order
    const orderItems = await this.orderRepository.findOrderItems(orderId);

    if (!orderItems || orderItems.length === 0) {
      throw new HttpError("No order items found", StatusCodes.NOT_FOUND);
    }

    for (const item of orderItems) {
      try {
        // Check if user is already enrolled in this course
        const existingEnrollment =
          await this.enrollmentRepository.findByUserAndCourse(
            userId,
            item.courseId
          );

        if (existingEnrollment) {
          console.log(
            `User ${userId} is already enrolled in course ${item.courseId}, skipping enrollment creation`
          );
          continue; // Skip creating duplicate enrollment
        }

        // Create new enrollment
        await this.enrollmentRepository.create({
          userId,
          courseIds: [item.courseId],
          orderItemId: item.id,
        });
        console.log(
          `Successfully created enrollment for course ${item.courseId}`
        );
      } catch (error) {
        console.error(
          "Error creating enrollment for course:",
          item.courseId,
          error
        );
        throw new HttpError(
          `Failed to create enrollment for course ${item.courseId}`,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    }

    // Distribute revenue
    try {
      await this.revenueDistributionService.distributeRevenue(orderId);
    } catch (error) {
      console.error("Error during revenue distribution:", error);
      throw new HttpError(
        "Failed to distribute revenue",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Clear cart items for purchased courses
    try {
      console.log("Clearing cart items for purchased courses");
      for (const item of orderItems) {
        await this.cartRepository.deleteByUserAndCourse(userId, item.courseId);
      }
      console.log("Cart items cleared successfully");
    } catch (error) {
      console.error("Error clearing cart items:", error);
      // Don't throw error here as the purchase was successful
      // Cart clearing is a cleanup operation
    }

    // Send real-time notifications via Socket.IO
    const orderItemsWithPrices = await Promise.all(
      orderItems.map(async (item) => {
        const course = await this.orderRepository.findCourseById(item.courseId);
        return {
          courseId: item.courseId,
          coursePrice: course?.price?.getValue()?.toNumber() || 0
        };
      })
    );
    await this.sendPurchaseNotifications({ userId }, orderItemsWithPrices);

    return {
      data: {
        transaction,
      },
      message: "Payment processed successfully using wallet",
    };
  }

  async createStripeCheckoutSession(
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
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", StatusCodes.NOT_FOUND);
    }

    const courseIds = input.courses?.map(c => c.id) || [];
    const isEnrolled = await this.enrollmentRepository.findByUserIdAndCourseIds(userId, courseIds);

    console.log(isEnrolled , 'courseneroleled -=-==============>')
    
    if (isEnrolled && isEnrolled.length > 0) {
      throw new HttpError("User already enrolled in this course", 400);
    }

    const session = await this.paymentGateway.createCheckoutSession(
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
      message: "Checkout session created successfully",
    };
  }

  async handleStripeWebhook(
    event: WebhookEvent
  ): Promise<ServiceResponse<{ order?: Order; transaction?: Transaction }>> {
    try {
      // Handle successful payments
      if (event.type === "checkout.session.completed") {
        console.log("=== Processing Successful Payment ===");
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Session Data:", JSON.stringify(session, null, 2));

        const orderId = session.metadata?.orderId;
        const isWalletTopUp = session.metadata?.isWalletTopUp === "true";

        console.log("Order ID:", orderId);
        console.log("Is Wallet Top Up:", isWalletTopUp);

        if (!orderId) {
          console.error("No order ID found in session metadata");
          throw new HttpError(
            "No order ID found in session metadata",
            StatusCodes.BAD_REQUEST
          );
        }

        let transaction = await this.transactionRepository.findByOrderId(
          orderId
        );
        console.log("Found transaction:", transaction);

        if (!transaction && isWalletTopUp) {
          console.log("Looking for transaction by ID for wallet top up");
          transaction = await this.transactionRepository.findById(orderId);
        }

        if (!transaction) {
          console.error("Transaction not found for order:", orderId);
          throw new HttpError("Transaction not found", StatusCodes.NOT_FOUND);
        }

        // Update transaction status first
        console.log("Updating transaction status to COMPLETED");
        await this.transactionRepository.updateStatus(
          transaction.id,
          TransactionStatus.COMPLETED
        );

        if (isWalletTopUp) {
          console.log("Processing wallet top up");
          const wallet = await this.walletRepository.findByUserId(
            transaction.userId
          );
          if (!wallet) {
            console.error("Wallet not found for user:", transaction.userId);
            throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
          }
          wallet.addAmount(transaction.amount);
          await this.walletRepository.update(wallet);
          return {
            data: { transaction },
            message: "Wallet top-up completed successfully",
          };
        } else {
          try {
            console.log("=== Processing Course Purchase ===");
            // Update order status
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
              console.error("Order not found:", orderId);
              throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
            }

            console.log("Updating order status to COMPLETED");
            await this.orderRepository.updateOrderStatus(
              orderId,
              OrderStatus.COMPLETED,
              session.payment_intent as string,
              PaymentGatewayEnum.STRIPE
            );

            // Create enrollments
            console.log("Fetching order items");
            const orderItems = await this.orderRepository.findOrderItems(
              orderId
            );
            console.log("Found order items:", orderItems);

            if (!orderItems || orderItems.length === 0) {
              console.error("No order items found for order:", orderId);
              throw new HttpError(
                "No order items found",
                StatusCodes.NOT_FOUND
              );
            }

            console.log("Creating enrollments for", orderItems.length, "items");
            for (const item of orderItems) {
              console.log("Creating enrollment for course:", item.courseId);
              try {
                // Check if user is already enrolled in this course
                const existingEnrollment =
                  await this.enrollmentRepository.findByUserAndCourse(
                    order.userId,
                    item.courseId
                  );

                if (existingEnrollment) {
                  console.log(
                    `User ${order.userId} is already enrolled in course ${item.courseId}, skipping enrollment creation`
                  );
                  continue; // Skip creating duplicate enrollment
                }

                // Create new enrollment
                await this.enrollmentRepository.create({
                  userId: order.userId,
                  courseIds: [item.courseId],
                  orderItemId: item.id,
                });
                console.log(
                  "Successfully created enrollment for course:",
                  item.courseId
                );
              } catch (error) {
                console.error(
                  "Error creating enrollment for course:",
                  item.courseId,
                  error
                );
                throw error;
              }
            }

            // Distribute revenue
            console.log("Starting revenue distribution");
            try {
              await this.revenueDistributionService.distributeRevenue(orderId);
              console.log("Revenue distribution completed successfully");
            } catch (error) {
              console.error("Error during revenue distribution:", error);
              throw error;
            }

            // Clear cart items for purchased courses
            try {
              console.log("Clearing cart items for purchased courses");
              for (const item of orderItems) {
                await this.cartRepository.deleteByUserAndCourse(
                  order.userId,
                  item.courseId
                );
              }
              console.log("Cart items cleared successfully");
            } catch (error) {
              console.error("Error clearing cart items:", error);
              // Don't throw error here as the purchase was successful
              // Cart clearing is a cleanup operation
            }

            // Send real-time notifications via Socket.IO
            const orderItemsWithPrices = await Promise.all(
              orderItems.map(async (item) => {
                const course = await this.orderRepository.findCourseById(item.courseId);
                                 return {
                   courseId: item.courseId,
                   coursePrice: course?.price?.getValue()?.toNumber() || 0
                 };
              })
            );
            await this.sendPurchaseNotifications(order, orderItemsWithPrices);

            return {
              data: { order, transaction },
              message: "Payment completed successfully",
            };
          } catch (error) {
            console.error("Error processing successful payment:", error);
            // Revert transaction status if enrollment or revenue distribution fails
            console.log("Reverting transaction status to FAILED");
            await this.transactionRepository.updateStatus(
              transaction.id,
              TransactionStatus.FAILED
            );
            throw new HttpError(
              error instanceof Error
                ? error.message
                : "Error processing successful payment",
              StatusCodes.INTERNAL_SERVER_ERROR
            );
          }
        }
      }

      // Handle payment failures
      if (
        event.type === "payment_intent.payment_failed" ||
        event.type === "charge.failed"
      ) {
        console.log("Processing payment failure event");
        const paymentIntentId =
          event.data.object.payment_intent || event.data.object.id;
        console.log("Payment Intent ID:", paymentIntentId);

        const metadata = await this.webhookGateway.getCheckoutSessionMetadata(
          paymentIntentId
        );
        console.log("Session Metadata:", metadata);

        const orderId = metadata.orderId;
        console.log("Order ID from metadata:", orderId);

        if (!orderId) {
          console.error("No order ID found in metadata");
          throw new HttpError(
            "No order ID found in session metadata",
            StatusCodes.BAD_REQUEST
          );
        }

        const transaction = await this.transactionRepository.findByOrderId(
          orderId
        );
        console.log("Found transaction:", transaction);

        if (transaction) {
          console.log("Updating transaction status to FAILED");
          await this.transactionRepository.updateStatus(
            transaction.id,
            TransactionStatus.FAILED
          );
        }

        const order = await this.orderRepository.findById(orderId);
        if (!order) {
          console.error("Order not found:", orderId);
          throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
        }

        console.log("Updating order status to FAILED");
        await this.orderRepository.updateOrderStatus(
          orderId,
          OrderStatus.FAILED,
          paymentIntentId,
          PaymentGatewayEnum.STRIPE
        );

                 return {
           data: {
             order: order,
             transaction: transaction || undefined,
           },
           message: "Payment failure handled",
         };
      }

      console.log("=== Webhook Processing End ===");
      return {
        data: {},
        message: "Webhook processed successfully",
      };
    } catch (error) {
      console.error("=== Webhook Processing Error ===");
      console.error("Error details:", error);
      throw new HttpError(
        error instanceof Error ? error.message : "Error processing webhook",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async sendPurchaseNotifications(
    order: { userId: string },
    orderItems: { courseId: string; coursePrice: string | number }[]
  ): Promise<void> {
    try {
      const io = getSocketIOInstance();
      if (!io) {
        console.log("Socket.IO not available for notifications");
        return;
      }

      const { items: admins } = await this.userRepository.findAll({
        role: "ADMIN",
        page: 1,
        limit: 1,
        includeDeleted: false,
        sortBy: 'createdAt',
        filterBy: 'All',
        search: '',
        sortOrder:'asc'
      });

      if (!admins || admins.length === 0) {
        console.error("Admin user not found for notifications");
        return;
      }
      const adminId = admins[0].id;

      // Process each order item and send notifications
      for (const item of orderItems) {
        const course = await this.orderRepository.findCourseById(item.courseId);
        if (!course) {
          console.error("Course not found for notifications:", item.courseId);
          continue;
        }

        // Calculate shares (same logic as revenue distribution)
        const coursePrice = Number(item.coursePrice);
        const adminShare = (coursePrice * 20) / 100; // 20% admin share
        const instructorShare = (coursePrice * 80) / 100; // 80% instructor share

        // 1. Notify instructor about revenue earned
        io.to(course.createdBy).emit("newNotification", {
          message: `Revenue earned: $${instructorShare.toFixed(
            2
          )} from course "${course.title}" purchase.`,
          type: "REVENUE_EARNED",
          courseId: course.id,
          courseTitle: course.title,
          amount: instructorShare,
        });

        // 2. Notify admin about revenue earned
        io.to(adminId).emit("newNotification", {
          message: `Revenue earned: $${adminShare.toFixed(2)} from course "${
            course.title
          }" purchase.`,
          type: "REVENUE_EARNED",
          courseId: course.id,
          courseTitle: course.title,
          amount: adminShare,
        });

        // 3. Notify purchaser about course purchase completion
        io.to(order.userId).emit("newNotification", {
          message: `Course "${course.title}" purchase completed! You're ready to start learning.`,
          type: "COURSE_PURCHASED",
          courseId: course.id,
          courseTitle: course.title,
        });
      }
    } catch (error) {
      console.error(
        "Error sending purchase notifications via Socket.IO:",
        error
      );
      // Don't throw error to avoid breaking the payment process
    }
  }
}
