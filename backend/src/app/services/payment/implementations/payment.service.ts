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
    private readonly _walletRepository: IWalletRepository,
    private readonly _orderRepository: IOrderRepository,
    private readonly _transactionRepository: ITransactionRepository,
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _paymentGateway: PaymentGateway,
    private readonly _webhookGateway: StripeWebhookGateway,
    private readonly _userRepository: IUserRepository,
    private readonly _revenueDistributionService: IRevenueDistributionService,
    private readonly _cartRepository: ICartRepository
  ) {}

  async handleWalletPayment(
    userId: string,
    orderId: string,
    amount: number
  ): Promise<ServiceResponse<{ transaction: Transaction }>> {
    const wallet = await this._walletRepository.findByUserId(userId);
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
    await this._walletRepository.update(wallet);

    // Create transaction
    const transaction = new Transaction({
      orderId,
      userId,
      amount,
      type: TransactionType.PURCHASE,
      status: TransactionStatus.COMPLETED,
      paymentGateway: PaymentGatewayEnum.WALLET,
    });
    await this._transactionRepository.create(transaction);

    // Update order status
    await this._orderRepository.updateOrderStatus(
      orderId,
      OrderStatus.COMPLETED,
      transaction.id,
      PaymentGatewayEnum.WALLET
    );

    // Create enrollments for each course in the order
    const orderItems = await this._orderRepository.findOrderItems(orderId);

    if (!orderItems || orderItems.length === 0) {
      throw new HttpError("No order items found", StatusCodes.NOT_FOUND);
    }

    for (const item of orderItems) {
      try {
        // Check if user is already enrolled in this course
        const existingEnrollment =
          await this._enrollmentRepository.findByUserAndCourse(
            userId,
            item.courseId
          );

        if (existingEnrollment) {
          continue; 
        }

        // Create new enrollment
        await this._enrollmentRepository.create({
          userId,
          courseIds: [item.courseId],
          orderItemId: item.id,
        });
      } catch (error) {
        throw new HttpError(
          `Failed to create enrollment for course ${item.courseId}`,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    }

    // Distribute revenue
    try {
      await this._revenueDistributionService.distributeRevenue(orderId);
    } catch (error) {
      throw new HttpError(
        "Failed to distribute revenue",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Clear cart items for purchased courses
    try {
      for (const item of orderItems) {
        await this._cartRepository.deleteByUserAndCourse(userId, item.courseId);
      }
    } catch {

    }

    // Send real-time notifications via Socket.IO
    const orderItemsWithPrices = await Promise.all(
      orderItems.map(async (item) => {
        const course = await this._orderRepository.findCourseById(item.courseId);
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
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", StatusCodes.NOT_FOUND);
    }

    const courseIds = input.courses?.map(c => c.id) || [];
    const isEnrolled = await this._enrollmentRepository.findByUserIdAndCourseIds(userId, courseIds);

    
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
      message: "Checkout session created successfully",
    };
  }

  async handleStripeWebhook(
    event: WebhookEvent
  ): Promise<ServiceResponse<{ order?: Order; transaction?: Transaction }>> {
    try {
      // Handle successful payments
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId;
        const isWalletTopUp = session.metadata?.isWalletTopUp === "true";

        if (!orderId) {
          throw new HttpError(
            "No order ID found in session metadata",
            StatusCodes.BAD_REQUEST
          );
        }

        let transaction = await this._transactionRepository.findByOrderId(
          orderId
        );

        if (!transaction && isWalletTopUp) {
          transaction = await this._transactionRepository.findById(orderId);
        }

        if (!transaction) {
          // Create transaction if it doesn't exist (this can happen if the initial transaction creation failed)
          console.log("Creating missing transaction for order:", orderId);
          try {
            transaction = await this._transactionRepository.create(
              new Transaction({
                orderId,
                userId: session.metadata?.userId || "",
                amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
                type: TransactionType.PURCHASE,
                status: TransactionStatus.COMPLETED,
                paymentGateway: PaymentGatewayEnum.STRIPE,
                transactionId: session.payment_intent as string,
                paymentMethod: "STRIPE",
                metadata: {
                  stripeSessionId: session.id,
                  isWalletTopUp: isWalletTopUp,
                  ...session.metadata
                }
              })
            );
          } catch (error) {
                         // If transaction creation fails due to duplicate transactionId, try to find existing transaction
             if (error instanceof Error && error.message.includes('already exists')) {
               console.log("Transaction already exists, trying to find by transactionId");
               // Try to find by transactionId instead
               transaction = await this._transactionRepository.findByTransactionId(session.payment_intent as string);
               
               if (!transaction) {
                 throw new HttpError("Failed to create or find transaction", StatusCodes.INTERNAL_SERVER_ERROR);
               }
             } else {
               throw error;
             }
          }
        } else {
          // Update existing transaction status
          await this._transactionRepository.updateStatus(
            transaction.id,
            TransactionStatus.COMPLETED
          );
        }

        if (isWalletTopUp) {
          const wallet = await this._walletRepository.findByUserId(
            transaction.userId
          );
          if (!wallet) {
            throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
          }
          wallet.addAmount(transaction.amount);
          await this._walletRepository.update(wallet);
          return {
            data: { transaction },
            message: "Wallet top-up completed successfully",
          };
        } else {
          try {
            // Update order status
            const order = await this._orderRepository.findById(orderId);
            if (!order) {
              throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
            }

            await this._orderRepository.updateOrderStatus(
              orderId,
              OrderStatus.COMPLETED,
              session.payment_intent as string,
              PaymentGatewayEnum.STRIPE
            );

            const orderItems = await this._orderRepository.findOrderItems(
              orderId
            );

            if (!orderItems || orderItems.length === 0) {
              throw new HttpError(
                "No order items found",
                StatusCodes.NOT_FOUND
              );
            }

            for (const item of orderItems) {
              try {
                // Check if user is already enrolled in this course
                const existingEnrollment =
                  await this._enrollmentRepository.findByUserAndCourse(
                    order.userId,
                    item.courseId
                  );

                if (existingEnrollment) {
                  continue; // Skip creating duplicate enrollment
                }

                // Create new enrollment
                await this._enrollmentRepository.create({
                  userId: order.userId,
                  courseIds: [item.courseId],
                  orderItemId: item.id,
                });
              } catch (error) {
                throw error;
              }
            }

            try {
              await this._revenueDistributionService.distributeRevenue(orderId);
            } catch (error) {
              throw error;
            }

           
              for (const item of orderItems) {
                await this._cartRepository.deleteByUserAndCourse(
                  order.userId,
                  item.courseId
                );
              }

            // Send real-time notifications via Socket.IO
            const orderItemsWithPrices = await Promise.all(
              orderItems.map(async (item) => {
                const course = await this._orderRepository.findCourseById(item.courseId);
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
            await this._transactionRepository.updateStatus(
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
        const paymentIntentId =
          event.data.object.payment_intent || event.data.object.id;

        const metadata = await this._webhookGateway.getCheckoutSessionMetadata(
          paymentIntentId
        );

        const orderId = metadata.orderId;

        if (!orderId) {
          throw new HttpError(
            "No order ID found in session metadata",
            StatusCodes.BAD_REQUEST
          );
        }

        const transaction = await this._transactionRepository.findByOrderId(
          orderId
        );

        if (transaction) {
          await this._transactionRepository.updateStatus(
            transaction.id,
            TransactionStatus.FAILED
          );
        }

        const order = await this._orderRepository.findById(orderId);
        if (!order) {
          throw new HttpError("Order not found", StatusCodes.NOT_FOUND);
        }

        await this._orderRepository.updateOrderStatus(
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

      return {
        data: {},
        message: "Webhook processed successfully",
      };
    } catch (error) {
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
      const io = getSocketIOInstance();
      if (!io) {
        return;
      }

      const { items: admins } = await this._userRepository.findAll({
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
        return;
      }
      const adminId = admins[0].id;

      // Process each order item and send notifications
      for (const item of orderItems) {
        const course = await this._orderRepository.findCourseById(item.courseId);
        if (!course) {
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
    } 
  }

