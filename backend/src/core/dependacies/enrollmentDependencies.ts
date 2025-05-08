import { CourseService } from "../../modules/course/course.service";
import { EnrollmentController } from "../../modules/enrollment/enrollment.controller";
import { EnrollmentRepository } from "../../modules/enrollment/enrollment.repository";
import { EnrollmentService } from "../../modules/enrollment/enrollment.service";
import { OrderService } from "../../modules/order/order.service";
import { UserService } from "../../modules/user/user.service";
import { IDatabaseProvider } from "../database";

export interface EnrollmentDependencies {
  enrollmentService: EnrollmentService;
  enrollmentController: EnrollmentController;
  setPaymentService: (paymentService: OrderService) => void;
}

export const initializeEnrollmentDependencies = (
  dbProvider: IDatabaseProvider,
  userService: UserService,
  courseService: CourseService
): EnrollmentDependencies => {
  let paymentService: OrderService | undefined;

  const enrollmentRepository = new EnrollmentRepository(dbProvider.getClient());
  const enrollmentService = new EnrollmentService(
    enrollmentRepository,
    userService,
    courseService,
    paymentService!
  );
  const enrollmentController = new EnrollmentController(enrollmentService);

  return {
    enrollmentService,
    enrollmentController,
    setPaymentService: (service: OrderService) => {
      paymentService = service;
      // Update EnrollmentService with the injected PaymentService
      Object.assign(enrollmentService, { paymentService });
    },
  };
};
