import { CourseService } from "../../modules/course/course.service";
import { EnrollmentService } from "../../modules/enrollment/enrollment.service";
import { OrderController } from "../../modules/order/order.controller";
import { OrderRepository } from "../../modules/order/order.repository";
import { OrderService } from "../../modules/order/order.service";
import { UserService } from "../../modules/user/user.service";
import { IDatabaseProvider } from "../database";

export interface OrderDependencies {
  orderService: OrderService;
  orderController: OrderController;
  setEnrollmentService: (enrollmentService: EnrollmentService) => void;
}

export const initializeOrderDependencies = (
  dbProvider: IDatabaseProvider,
  userService: UserService,
  courseService: CourseService
): OrderDependencies => {
  let enrollmentService: EnrollmentService | undefined;

  const orderRepository = new OrderRepository(dbProvider.getClient());
  const orderService = new OrderService(
    orderRepository,
    userService,
    courseService,
    enrollmentService!
  );
  const orderController = new OrderController(orderService);

  return {
    orderService,
    orderController,
    setEnrollmentService: (service: EnrollmentService) => {
      enrollmentService = service;
      // Update PaymentService with the injected EnrollmentService
      Object.assign(orderService, { enrollmentService });
    },
  };
};
