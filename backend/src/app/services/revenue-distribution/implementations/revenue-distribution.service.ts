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
    private _walletRepository: IWalletRepository,
    private _transactionRepository: ITransactionRepository,
    private _orderRepository: IOrderRepository,
    private _userRepository: IUserRepository,
    private _createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
  ) {}

  async distributeRevenue(orderId: string): Promise<void> {
    try {
      const orderItems = await this._orderRepository.findOrderItems(orderId);

      if (!orderItems || orderItems.length === 0) {
        throw new HttpError("No order items found", StatusCodes.NOT_FOUND);
      }


      for (const orderItem of orderItems) {
        try {
          await this.distributeRevenueForOrderItem(orderItem);
        } catch (error) {
          throw error; 
        }
      }
    } catch (error) {
      throw new HttpError(
        error instanceof Error ? error.message : "Error distributing revenue",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async distributeRevenueForOrderItem(orderItem: { 
    id: string; 
    courseId: string; 
    orderId: string; 
  }): Promise<void> {
    
    // Get the course to get the price
    const course = await this._orderRepository.findCourseById(
      orderItem.courseId
    );

    if (!course) {
      throw new HttpError("Course not found", StatusCodes.NOT_FOUND);
    }

    const coursePrice = course.price?.getValue()?.toNumber() || 0;
    const instructorId = course.createdBy;
    const { adminShare, instructorShare } = this.calculateShares(coursePrice);


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
    const { items } = await this._userRepository.findAll({
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
    let adminWallet = await this._walletRepository.findByUserId(adminId);
    if (!adminWallet) {
      adminWallet = Wallet.create(adminId);
      adminWallet = await this._walletRepository.create(adminWallet);
    }
    adminWallet.addAmount(adminShare);
    await this._walletRepository.update(adminWallet);

    // Get or create instructor wallet
    let instructorWallet = await this._walletRepository.findByUserId(
      instructorId
    );
    if (!instructorWallet) {
      instructorWallet = Wallet.create(instructorId);
      instructorWallet = await this._walletRepository.create(instructorWallet);
    }
    instructorWallet.addAmount(instructorShare);
    await this._walletRepository.update(instructorWallet);
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

    await this._transactionRepository.create(adminTransaction);
    await this._transactionRepository.create(instructorTransaction);
  }

  private async sendPurchaseNotifications(
    course: { id: string; title: string; createdBy: string },
    orderItem: { orderId: string },
    instructorShare: number,
    adminShare: number
  ): Promise<void> {
      // Get admin user ID and order details
      const adminId = await this.getAdminUserId();
      const order = await this._orderRepository.findById(orderItem.orderId);

      if (!order) {
        return;
      }

      // 1. Notify instructor about revenue earned
      await this._createNotificationsForUsersUseCase.execute(
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
      await this._createNotificationsForUsersUseCase.execute([adminId], {
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
      await this._createNotificationsForUsersUseCase.execute([order.userId], {
        eventType: NotificationEventType.COURSE_PURCHASED,
        entityType: NotificationEntityType.COURSE,
        entityId: course.id,
        entityName: course.title,
        message: `Course "${course.title}" purchase completed! You're ready to start learning.`,
        link: `/user/my-courses`,
      });
    
  }
}
