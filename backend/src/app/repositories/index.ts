// User related repositories
export { IUserRepository, IPaginatedResponse } from "./user.repository";
export { IAuthRepository } from "./auth.repository";
export { IInstructorRepository } from "./instructor.repository";

// Category and Course related repositories
export { ICategoryRepository } from "./category.repository";
export { ICourseRepository } from "./course.repository.interface";

// Lesson and Content related repositories
export { ILessonRepository } from "./lesson.repository";
export { ILessonContentRepository } from "./content.repository";

// Enrollment and Progress related repositories
export { IEnrollmentRepository } from "./enrollment.repository.interface";
export { ILessonProgressRepository } from "./lesson-progress.repository.interface";

// Cart and Order related repositories
export { ICartRepository } from "./cart.repository";
export { IOrderRepository } from "./order.repository";

// Payment and Transaction related repositories
export { ITransactionRepository } from "./transaction.repository";
export { IWalletRepository } from "./wallet.repository.interface";

// Review and Communication related repositories
export { ICourseReviewRepository } from "./course-review.repository.interface";
export { IChatRepository } from "./chat.repository.interface";
export { IMessageRepository } from "./message.repository.interface";

// Notification and Certificate related repositories
export { NotificationRepositoryInterface } from "./notification-repository.interface";
export { CertificateRepositoryInterface } from "./certificate-repository.interface";

// Search repository
export { ISearchRepository } from "./search.repository";

// Revenue repository
export { IRevenueRepository } from "./revenue.repository"; 