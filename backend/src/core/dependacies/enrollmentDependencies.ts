import { CourseService } from "../../modules/course/course.service";
import { EnrollmentController } from "../../modules/enrollment/enrollment.controller";
import { EnrollmentRepository } from "../../modules/enrollment/enrollment.repository";
import { EnrollmentService } from "../../modules/enrollment/enrollment.service";
import { PaymentService } from "../../modules/payment/payment.service";
import { UserService } from "../../modules/user/user.service";
import { IDatabaseProvider } from "../database";


export interface EnrollmentDependencies {
  enrollmentService: EnrollmentService;
  enrollmentController: EnrollmentController;
  setPaymentService: (paymentService: PaymentService) => void;
}

export const initializeEnrollmentDependencies = (
  dbProvider: IDatabaseProvider,
  userService: UserService,
  courseService: CourseService
): EnrollmentDependencies => {
  let paymentService: PaymentService | undefined;

  const enrollmentRepository = new EnrollmentRepository(
    dbProvider.getClient()
  );
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
    setPaymentService: (service: PaymentService) => {
      paymentService = service;
      // Update EnrollmentService with the injected PaymentService
      Object.assign(enrollmentService, { paymentService });
    },
  };
};
