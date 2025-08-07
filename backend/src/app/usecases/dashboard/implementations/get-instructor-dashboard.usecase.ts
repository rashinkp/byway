import { IGetInstructorDashboardUseCase } from "../interfaces/get-instructor-dashboard.usecase.interface";
import {
  IGetInstructorDashboardInput,
  IInstructorDashboardResponse,
} from "../../..//dtos/instructor/instructor-dashboard.dto";
import { IRevenueRepository } from "../../..//repositories/revenue.repository";
import { IUserRepository } from "../../..//repositories/user.repository";
import { IEnrollmentRepository } from "../../..//repositories/enrollment.repository.interface";
import { ICourseRepository } from "@/app/repositories/course.repository.interface";

export class GetInstructorDashboardUseCase
  implements IGetInstructorDashboardUseCase
{
  constructor(
    private courseRepository: ICourseRepository,
    private enrollmentRepository: IEnrollmentRepository,
    private revenueRepository: IRevenueRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    input: IGetInstructorDashboardInput
  ): Promise<IInstructorDashboardResponse> {
    const { instructorId, limit = 5 } = input;

    // Get all courses by this instructor (including deleted courses)
    const coursesResponse = await this.courseRepository.findAll({
      userId: instructorId,
      includeDeleted: true, // Include deleted courses
      role: "INSTRUCTOR", // Set role to INSTRUCTOR to get correct filtering
      page: 1,
      limit: 1000, // Get all courses
    });
    const courses = coursesResponse.courses;
    const courseIds = courses.map((c: any) => c.id);

    // Total courses (including deleted)
    const totalCourses = courses.length;

    // Active courses (only non-deleted PUBLISHED courses)
    const activeCourses = courses.filter(
      (c: any) => c.status === "PUBLISHED" && !c.deletedAt
    ).length;

    // Pending courses (including deleted)
    const pendingCourses = courses.filter(
      (c: any) => c.status === "PENDING"
    ).length;

    // Completed/Archived courses (including deleted)
    const completedCourses = courses.filter(
      (c: any) => c.status === "ARCHIVED"
    ).length;

    // Get enrollments for these courses using existing method
    const enrollments: any[] = [];
    for (const courseId of courseIds) {
      const courseEnrollments = await this.enrollmentRepository.findByCourseId(
        courseId
      );
      enrollments.push(...courseEnrollments);
    }

    const totalEnrollments = enrollments.length;
    const totalStudents = new Set(enrollments.map((e: any) => e.userId)).size;

    // Get revenue for these courses (using existing method if available)
    let totalRevenue = 0;
    try {
      totalRevenue = await this.revenueRepository.getTotalRevenue(instructorId);
    } catch {
      // Fallback: calculate from enrollments if revenue method not available
      totalRevenue = enrollments.reduce((sum: number, e: any) => {
        if (
          e.orderItem &&
          e.orderItem.order &&
          e.orderItem.order.paymentStatus === "COMPLETED"
        ) {
          const itemPrice = Number(e.orderItem.coursePrice);
          const adminSharePercentage = Number(e.orderItem.adminSharePercentage);
          const adminRevenue = itemPrice * (adminSharePercentage / 100);
          const instructorRevenue = itemPrice - adminRevenue; // Instructor gets the remaining amount
          return sum + instructorRevenue;
        }
        return sum;
      }, 0);
    }

    // Top courses by enrollments (using existing method)
    const topCoursesResponse =
      await this.courseRepository.getTopEnrolledCourses({
        userId: instructorId,
        limit,
        role: "INSTRUCTOR",
      });

    // Map to correct type (no need to filter since repository handles it)
    const topCourses = topCoursesResponse.map((course: any) => ({
      courseId: course.courseId,
      courseTitle: course.courseTitle,
      enrollmentCount: course.enrollmentCount,
      revenue: course.revenue,
      rating: course.rating,
      reviewCount: course.reviewCount,
      status:
        courses.find((c: any) => c.id === course.courseId)?.status || "DRAFT",
      createdAt: new Date(
        courses.find((c: any) => c.id === course.courseId)?.createdAt ||
          new Date()
      ),
      lastEnrollmentDate: undefined,
    }));

    // Recent students - get unique student IDs and fetch their data
    const studentIds = Array.from(
      new Set(enrollments.map((e: any) => e.userId))
    );
    const recentStudents: any[] = [];
    for (const studentId of studentIds.slice(0, limit)) {
      const student = await this.userRepository.findById(studentId);
      if (student) recentStudents.push(student);
    }

    // Recent enrollments
    const recentEnrollments = enrollments
      .sort((a: any, b: any) => b.enrolledAt.getTime() - a.enrolledAt.getTime())
      .slice(0, limit)
      .map((e: any) => ({
        courseId: e.courseId,
        courseTitle: courses.find((c: any) => c.id === e.courseId)?.title || "",
        studentName:
          recentStudents.find((s: any) => s.id === e.userId)?.name || "",
        enrolledAt: e.enrolledAt,
      }));

    // Average rating and total reviews (if available) - including deleted courses
    const averageRating = courses.length
      ? courses.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) /
        courses.length
      : 0;
    const totalReviews = courses.reduce(
      (sum: number, c: any) => sum + (c.reviewCount || 0),
      0
    );

    return {
      stats: {
        totalCourses,
        totalStudents,
        totalEnrollments,
        totalRevenue,
        activeCourses,
        pendingCourses,
        completedCourses,
        averageRating,
        totalReviews,
      },
      topCourses,
      recentStudents: recentStudents.map((s: any) => {
        const studentEnrollments = enrollments.filter(
          (e: any) => e.userId === s.id
        );
        return {
          studentId: s.id,
          studentName: s.name,
          email: s.email,
          enrolledCourses: studentEnrollments.length,
          lastEnrollmentDate: studentEnrollments.sort(
            (a: any, b: any) => b.enrolledAt.getTime() - a.enrolledAt.getTime()
          )[0]?.enrolledAt,
          isActive: !s.deletedAt,
        };
      }),
      recentEnrollments,
    };
  }
}
