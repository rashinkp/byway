import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { IRevenueDistributionService } from "../interfaces/revenue-distribution.service.interface";
import { IOrderRepository } from "../../../repositories/order.repository";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { Wallet } from "../../../../domain/entities/wallet.entity";
import { IUserRepository } from "../../../repositories/user.repository";
import { CreateNotificationsForUsersUseCase } from "../../../usecases/notification/implementations/create-notifications-for-users.usecase";
import { NotificationEventType } from "../../../../domain/enum/notification-event-type.enum";
import { NotificationEntityType } from "../../../../domain/enum/notification-entity-type.enum";

export class RevenueDistributionService implements IRevenueDistributionService {
  private readonly ADMIN_SHARE_PERCENTAGE = 20;
  private readonly INSTRUCTOR_SHARE_PERCENTAGE = 80;

  constructor(
    private walletRepository: IWalletRepository,
    private transactionRepository: ITransactionRepository,
    private orderRepository: IOrderRepository,
    private userRepository: IUserRepository,
    private createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async distributeRevenue(orderId: string): Promise<void> {
    try {
      const orderItems = await this.orderRepository.findOrderItems(orderId);

      if (!orderItems || orderItems.length === 0) {
        throw new HttpError("No order items found", StatusCodes.NOT_FOUND);
      }

      console.log(
        `Distributing revenue for order ${orderId} with ${orderItems.length} items`
      );

      for (const orderItem of orderItems) {
        try {
          await this.distributeRevenueForOrderItem(orderItem);
        } catch (error) {
          console.error(
            `Error distributing revenue for order item ${orderItem.id}:`,
            error
          );
          throw error; // Re-throw to handle in the main try-catch
        }
      }
    } catch (error) {
      console.error("Error distributing revenue:", error);
      throw new HttpError(
        error instanceof Error ? error.message : "Error distributing revenue",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async distributeRevenueForOrderItem(orderItem: { 
    id: string; 
    courseId: string; 
    coursePrice: string | number; 
    orderId: string; 
  }): Promise<void> {
    console.log(
      `Processing order item ${orderItem.id} with price ${orderItem.coursePrice}`
    );
    const coursePrice = orderItem.coursePrice;
    const course = await this.orderRepository.findCourseById(
      orderItem.courseId
    );

    if (!course) {
      throw new HttpError("Course not found", StatusCodes.NOT_FOUND);
    }

    const instructorId = course.createdBy;
    const { adminShare, instructorShare } = this.calculateShares(coursePrice);

    console.log(
      `Calculated shares - Admin: ${adminShare}, Instructor: ${instructorShare}`
    );

    await this.updateWallets(instructorId, adminShare, instructorShare);
    await this.createTransactions(
      instructorId,
      adminShare,
      instructorShare,
      orderItem.orderId,
      coursePrice
    );

    // Send notifications to instructor and admin
    await this.sendPurchaseNotifications(
      course,
      orderItem,
      instructorShare,
      adminShare
    );
  }

  private calculateShares(coursePrice: number): {
    adminShare: number;
    instructorShare: number;
  } {
    const adminShare = (coursePrice * this.ADMIN_SHARE_PERCENTAGE) / 100;
    const instructorShare =
      (coursePrice * this.INSTRUCTOR_SHARE_PERCENTAGE) / 100;
    return { adminShare, instructorShare };
  }

  private async getAdminUserId(): Promise<string> {
    const { items } = await this.userRepository.findAll({
      role: "ADMIN",
      page: 1,
      limit: 1,
      includeDeleted: false,
      sortBy: "createdAt",
      filterBy: "All",
      search: "",
      sortOrder: "asc",
    });

    if (!items || items.length === 0) {
      throw new HttpError("Admin user not found", StatusCodes.NOT_FOUND);
    }
    return items[0].id;
  }

  private async updateWallets(
    instructorId: string,
    adminShare: number,
    instructorShare: number
  ): Promise<void> {
    // Get admin user ID
    const adminId = await this.getAdminUserId();

    // Get or create admin wallet
    let adminWallet = await this.walletRepository.findByUserId(adminId);
    if (!adminWallet) {
      console.log("Creating admin wallet");
      adminWallet = Wallet.create(adminId);
      adminWallet = await this.walletRepository.create(adminWallet);
    }
    adminWallet.addAmount(adminShare);
    await this.walletRepository.update(adminWallet);

    // Get or create instructor wallet
    let instructorWallet = await this.walletRepository.findByUserId(
      instructorId
    );
    if (!instructorWallet) {
      console.log("Creating instructor wallet for:", instructorId);
      instructorWallet = Wallet.create(instructorId);
      instructorWallet = await this.walletRepository.create(instructorWallet);
    }
    instructorWallet.addAmount(instructorShare);
    await this.walletRepository.update(instructorWallet);
  }

  private async createTransactions(
    instructorId: string,
    adminShare: number,
    instructorShare: number,
    orderId: string,
    coursePrice: number
  ): Promise<void> {
    const adminId = await this.getAdminUserId();

    const adminTransaction = Transaction.create({
      userId: adminId,
      amount: adminShare,
      type: TransactionType.REVENUE,
      status: TransactionStatus.COMPLETED,
      paymentGateway: PaymentGateway.INTERNAL,
      orderId,
      description: `Revenue share from course purchase (${coursePrice})`,
    });

    const instructorTransaction = Transaction.create({
      userId: instructorId,
      amount: instructorShare,
      type: TransactionType.REVENUE,
      status: TransactionStatus.COMPLETED,
      paymentGateway: PaymentGateway.INTERNAL,
      orderId,
      description: `Revenue share from course purchase (${coursePrice})`,
    });

    await this.transactionRepository.create(adminTransaction);
    await this.transactionRepository.create(instructorTransaction);
  }

  private async sendPurchaseNotifications(
    course: { id: string; title: string; createdBy: string },
    orderItem: { orderId: string },
    instructorShare: number,
    adminShare: number
  ): Promise<void> {
    try {
      // Get admin user ID and order details
      const adminId = await this.getAdminUserId();
      const order = await this.orderRepository.findById(orderItem.orderId);

      if (!order) {
        console.error("Order not found for notifications");
        return;
      }

      // 1. Notify instructor about revenue earned
      await this.createNotificationsForUsersUseCase.execute(
        [course.createdBy],
        {
          eventType: NotificationEventType.REVENUE_EARNED,
          entityType: NotificationEntityType.PAYMENT,
          entityId: course.id,
          entityName: course.title,
          message: `Revenue earned: $${instructorShare.toFixed(
            2
          )} from course "${course.title}" purchase.`,
          link: `/instructor/wallet`,
        }
      );

      // 2. Notify admin about revenue earned
      await this.createNotificationsForUsersUseCase.execute([adminId], {
        eventType: NotificationEventType.REVENUE_EARNED,
        entityType: NotificationEntityType.PAYMENT,
        entityId: course.id,
        entityName: course.title,
        message: `Revenue earned: $${adminShare.toFixed(2)} from course "${
          course.title
        }" purchase.`,
        link: `/admin/wallet`,
      });

      // 3. Notify purchaser about course purchase completion
      await this.createNotificationsForUsersUseCase.execute([order.userId], {
        eventType: NotificationEventType.COURSE_PURCHASED,
        entityType: NotificationEntityType.COURSE,
        entityId: course.id,
        entityName: course.title,
        message: `Course "${course.title}" purchase completed! You're ready to start learning.`,
        link: `/user/my-courses`,
      });
    } catch (error) {
      console.error("Error sending purchase notifications:", error);
    }
  }
}
