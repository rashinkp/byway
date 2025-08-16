import { IGetInstructorDashboardUseCase } from "../interfaces/get-instructor-dashboard.usecase.interface";
import { IRevenueRepository } from "../../..//repositories/revenue.repository";
import { IUserRepository } from "../../..//repositories/user.repository";
import { IEnrollmentRepository } from "../../..//repositories/enrollment.repository.interface";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { DashboardInput, InstructorDashboardResponse } from "../../../dtos/stats.dto";

export class GetInstructorDashboardUseCase implements IGetInstructorDashboardUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private enrollmentRepository: IEnrollmentRepository,
    private revenueRepository: IRevenueRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(input: DashboardInput): Promise<InstructorDashboardResponse> {
    const { instructorId, limit = 5 } = input;

    // Get all courses by this instructor (including deleted courses)
    const coursesResponse = await this.courseRepository.findAll({
      userId: instructorId,
      includeDeleted: true, // Include deleted courses
      role: "INSTRUCTOR", // Set role to INSTRUCTOR to get correct filtering
      page: 1,
      limit: 1000, // Get all courses
    });
    const courses = coursesResponse.items;
    const courseIds = courses.map((c: { id: string }) => c.id);

    // Total courses (including deleted)
    const totalCourses = courses.length;

    // Active courses (only non-deleted PUBLISHED courses)
    const activeCourses = courses.filter(
      (c: { status: string; deletedAt: Date | null }) => c.status === "PUBLISHED" && !c.deletedAt
    ).length;

    // Pending courses (including deleted)
    const pendingCourses = courses.filter(
      (c: { status: string }) => c.status === "PENDING"
    ).length;

    // Completed/Archived courses (including deleted)
    const completedCourses = courses.filter(
      (c: { status: string }) => c.status === "ARCHIVED"
    ).length;

    // Get enrollments for these courses using existing method
    const enrollments: Array<{
      userId: string;
      enrolledAt: Date;
      orderItem?: {
        coursePrice: string | number;
        adminSharePercentage: string | number;
        order?: {
          paymentStatus: string;
        };
      };
    }> = [];
    for (const courseId of courseIds) {
      const courseEnrollments = await this.enrollmentRepository.findByCourseId(
        courseId
      );
      enrollments.push(...courseEnrollments);
    }

    const totalEnrollments = enrollments.length;
    const totalStudents = new Set(enrollments.map((e: { userId: string }) => e.userId)).size;

    // Get revenue for these courses (using existing method if available)
    let totalRevenue = 0;
    try {
      totalRevenue = await this.revenueRepository.getTotalRevenue(instructorId);
    } catch {
      // Fallback: calculate from enrollments if revenue method not available
      totalRevenue = enrollments.reduce((sum: number, e: { orderItem?: { coursePrice: string | number; adminSharePercentage: string | number; order?: { paymentStatus: string } } }) => {
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
    const topCourses = topCoursesResponse.map((course: { courseId: string; courseTitle: string; enrollmentCount: number; revenue: number; rating: number; reviewCount: number }) => ({
      courseId: course.courseId,
      courseTitle: course.courseTitle,
      enrollmentCount: course.enrollmentCount,
      revenue: course.revenue,
      rating: course.rating,
      reviewCount: course.reviewCount,
      status:
        courses.find((c: { id: string }) => c.id === course.courseId)?.status || "DRAFT",
      createdAt: new Date(
        courses.find((c: { id: string; createdAt: Date }) => c.id === course.courseId)?.createdAt ||
          new Date()
      ),
      lastEnrollmentDate: undefined,
    }));

    // Recent students - get unique student IDs and fetch their data
    const studentIds = Array.from(
      new Set(enrollments.map((e: { userId: string }) => e.userId))
    );
    const recentStudents: Array<{ id: string; name: string; email: string; [key: string]: unknown }> = [];
    for (const studentId of studentIds.slice(0, limit)) {
      const student = await this.userRepository.findById(studentId);
      if (student) recentStudents.push(student);
    }

    // Recent enrollments
    const recentEnrollments = enrollments
      .sort((a: { enrolledAt: Date }, b: { enrolledAt: Date }) => b.enrolledAt.getTime() - a.enrolledAt.getTime())
      .slice(0, limit)
      .map((e: { courseId: string; userId: string; enrolledAt: Date }) => ({
        courseId: e.courseId,
        courseTitle: courses.find((c: { id: string }) => c.id === e.courseId)?.title || "",
        studentName:
          recentStudents.find((s: { id: string }) => s.id === e.userId)?.name || "",
        enrolledAt: e.enrolledAt,
      }));

    // Average rating and total reviews (if available) - including deleted courses
    const averageRating = courses.length
      ? courses.reduce((sum: number, c: { rating: number | undefined }) => sum + (c.rating || 0), 0) /
        courses.length
      : 0;
    const totalReviews = courses.reduce(
      (sum: number, c: { reviewCount: number | undefined }) => sum + (c.reviewCount || 0),
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
      recentStudents: recentStudents.map((s: { id: string; name: string; email: string; [key: string]: unknown }) => {
        const studentEnrollments = enrollments.filter(
          (e: { userId: string }) => e.userId === s.id
        );
        return {
          studentId: s.id,
          studentName: s.name,
          email: s.email,
          enrolledCourses: studentEnrollments.length,
          lastEnrollmentDate: studentEnrollments.sort(
            (a: { enrolledAt: Date }, b: { enrolledAt: Date }) => b.enrolledAt.getTime() - a.enrolledAt.getTime()
          )[0]?.enrolledAt,
          isActive: !s.deletedAt,
        };
      }),
      recentEnrollments,
    };
  }
}
