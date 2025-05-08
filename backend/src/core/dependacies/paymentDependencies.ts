import { CourseService } from "../../modules/course/course.service";
import { EnrollmentService } from "../../modules/enrollment/enrollment.service";
import { PaymentController } from "../../modules/payment/payment.controller";
import { OrderRepository } from "../../modules/payment/payment.repository";
import { PaymentService } from "../../modules/payment/payment.service";
import { UserService } from "../../modules/user/user.service";
import { IDatabaseProvider } from "../database";


export interface PaymentDependencies {
  paymentService: PaymentService;
  paymentController: PaymentController;
  setEnrollmentService: (enrollmentService: EnrollmentService) => void;
}

export const initializePaymentDependencies = (
  dbProvider: IDatabaseProvider,
  userService: UserService,
  courseService: CourseService,
): PaymentDependencies => {
  let enrollmentService: EnrollmentService | undefined;

  const orderRepository = new OrderRepository(dbProvider.getClient());
  const paymentService = new PaymentService(
    orderRepository,
    userService,
    courseService,
    enrollmentService!,
  );
  const paymentController = new PaymentController(paymentService);

  return {
    paymentService,
    paymentController,
    setEnrollmentService: (service: EnrollmentService) => {
      enrollmentService = service;
      // Update PaymentService with the injected EnrollmentService
      Object.assign(paymentService, { enrollmentService });
    },
  };
};
