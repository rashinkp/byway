import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { UserService } from "../user/user.service";
import { CourseService } from "../course/course.service";
import { IOrderRepository } from "./order.repository.interface";
import { IOrder, ICourseInput } from "./order.types";
import { EnrollmentService } from "../enrollment/enrollment.service";

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private userService: UserService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {}

  async createOrder(
    userId: string,
    courses: ICourseInput[],
    couponCode?: string
  ): Promise<IOrder> {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user || user.deletedAt) {
        throw AppError.notFound("User not found or deactivated");
      }

      // Validate courses against database
      const dbCourses = await Promise.all(
        courses.map(async (inputCourse) => {
          const course = await this.courseService.getCourseById(inputCourse.id);
          if (!course || course.deletedAt) {
            throw AppError.notFound(`Course not found: ${inputCourse.id}`);
          }
          if (course.status !== "PUBLISHED") {
            throw AppError.forbidden(
              `Course is not available: ${inputCourse.id}`
            );
          }
          // Validate price and offer
          if (course.price !== inputCourse.price) {
            throw AppError.badRequest(
              `Invalid price for course ${inputCourse.id}`
            );
          }
          if (
            inputCourse.offer &&
            (!course.offer || course.offer !== inputCourse.offer)
          ) {
            throw AppError.badRequest(
              `Invalid offer for course ${inputCourse.id}`
            );
          }
          return course;
        })
      );

      // Calculate amount and items
      const items = courses.map((inputCourse, index) => {
        const course = dbCourses[index];
        let coursePrice = course.price || 0;
        let discount = course.offer ? coursePrice - course.offer : 0;
        // TODO: Implement coupon validation logic when Coupon module is added
        if (couponCode) {
          // Placeholder: Validate coupon and apply discount
          // const coupon = await couponService.validateCoupon(couponCode, course.id);
          // discount += coupon.discount;
          // coursePrice -= coupon.discount;
        }
        return {
          courseId: course.id,
          courseTitle: inputCourse.title,
          coursePrice,
          discount: discount || null,
          couponId: couponCode || null,
        };
      });

      const amount = items.reduce(
        (total, item) => total + (item.coursePrice - (item.discount || 0)),
        0
      );

      const order = await this.orderRepository.createOrder({
        userId,
        items,
        amount,
        paymentStatus: "PENDING",
        paymentGateway: null,
        orderStatus: "PENDING",
      });

      // TODO: Create TransactionHistory record
      // await this.transactionHistoryService.createTransaction({
      //   orderId: order.id,
      //   userId,
      //   courseId: items.length === 1 ? items[0].courseId : null,
      //   amount,
      //   type: "PAYMENT",
      //   status: "PENDING",
      //   paymentGateway: null,
      //   transactionId: null,
      // });

      return order;
    } catch (error) {
      logger.error("Create order error:", {
        error,
        userId,
        courses,
        couponCode,
      });
      throw error;
    }
  }

  async updateOrderStatus(
    orderId: string,
    paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED",
    paymentId?: string,
    paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null
  ): Promise<IOrder> {
    try {
      const order = await this.orderRepository.findOrderById(orderId);
      if (!order) {
        throw AppError.notFound("Order not found");
      }

      const orderStatus =
        paymentStatus === "COMPLETED"
          ? "CONFIRMED"
          : paymentStatus === "FAILED"
          ? "CANCELLED"
          : order.orderStatus;

      const updatedOrder = await this.orderRepository.updateOrderStatus(
        orderId,
        paymentStatus,
        orderStatus,
        paymentId,
        paymentGateway
      );

      // TODO: Update TransactionHistory
      // await this.transactionHistoryService.updateTransactionStatus({
      //   orderId,
      //   paymentStatus,
      //   paymentId,
      //   paymentGateway,
      // });

      // If payment is COMPLETED, trigger enrollment creation for each OrderItem
      if (paymentStatus === "COMPLETED") {
        for (const item of updatedOrder.items) {
          await this.enrollmentService.createEnrollment(
            updatedOrder.userId,
            item.courseId,
            item.id
          );
        }
      }

      return updatedOrder;
    } catch (error) {
      logger.error("Update order status error:", {
        error,
        orderId,
        paymentStatus,
      });
      throw error;
    }
  }

  async findOrderById(orderId: string): Promise<IOrder | null> {
    try {
      const order = await this.orderRepository.findOrderById(orderId);
      return order;
    } catch (error) {
      logger.error("Find order error:", { error, orderId });
      throw error;
    }
  }
}
