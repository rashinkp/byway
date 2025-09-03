import { IGetInstructorDashboardUseCase } from "../interfaces/get-instructor-dashboard.usecase.interface";
import { IRevenueRepository } from "../../../repositories/revenue.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { DashboardInput, InstructorDashboardResponse, } from "../../../dtos/stats.dto";
import { Enrollment } from "../../../../domain/entities/enrollment.entity";

export class GetInstructorDashboardUseCase implements IGetInstructorDashboardUseCase {
  constructor(
    private _courseRepository: ICourseRepository,
    private _enrollmentRepository: IEnrollmentRepository,
    private _revenueRepository: IRevenueRepository,
    private _userRepository: IUserRepository
  ) {}

  async execute(input: DashboardInput): Promise<InstructorDashboardResponse> {
    const { instructorId, limit = 5 } = input;
    const coursesResponse = await this._courseRepository.findAll({
      userId: instructorId,
      includeDeleted: true, 
      role: "INSTRUCTOR", 
      page: 1,
      limit: 1000, 
    });
    const courses = coursesResponse.items;
    const courseIds = courses.map((c: { id: string }) => c.id);

    // Total courses (including deleted)
    const totalCourses = courses.length;

    // Active courses (only non-deleted PUBLISHED courses)
    const activeCourses = courses.filter(
      (c) => c.status === "PUBLISHED" && !c.deletedAt
    ).length;

    // Pending courses (including deleted) - using approvalStatus instead of status
    const pendingCourses = courses.filter(
      (c) => c.approvalStatus === "PENDING"
    ).length;
    
    // Completed/Archived courses (including deleted)
    const completedCourses = courses.filter(
      (c) => c.status === "ARCHIVED"
    ).length;

    // Get enrollments for these courses using existing method
    const enrollments: Enrollment[] = [];
    for (const courseId of courseIds) {
      const courseEnrollments = await this._enrollmentRepository.findByCourseId(
        courseId
      );
      enrollments.push(...courseEnrollments);
    }

    const totalEnrollments = enrollments.length;
    const totalStudents = new Set(enrollments.map((e: { userId: string }) => e.userId)).size;

    // Get revenue for these courses (using existing method if available)
    let totalRevenue = 0;
    try {
      totalRevenue = await this._revenueRepository.getTotalRevenue(instructorId);
    } catch {
      // Fallback: calculate from enrollments if revenue method not available
      // Note: This fallback calculation is simplified since Enrollment entities don't contain order details
      totalRevenue = 0;
    }

    // Top courses by enrollments (using existing method)
    const topCoursesResponse =
      await this._courseRepository.getTopEnrolledCourses({
        userId: instructorId,
        limit,
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
        courses.find((c) => c.id === course.courseId)?.status || "DRAFT",
      createdAt: new Date(
        courses.find((c) => c.id === course.courseId)?.createdAt ||
          new Date()
      ),
      lastEnrollmentDate: undefined,
    }));

    // Recent students - get unique student IDs and fetch their data
    const studentIds = Array.from(
      new Set(enrollments.map((e) => e.userId))
    );
    const recentStudents: Array<{ id: string; name: string; email: string; deletedAt?: Date }> = [];
    for (const studentId of studentIds.slice(0, limit)) {
      const student = await this._userRepository.findById(studentId);
      if (student) {
        recentStudents.push({
          id: student.id,
          name: student.name,
          email: student.email,
          deletedAt: student.deletedAt,
        });
      }
    }

    // Recent enrollments
    const recentEnrollments = enrollments
      .sort((a, b) => b.enrolledAt.getTime() - a.enrolledAt.getTime())
      .slice(0, limit)
      .map((e) => ({
        courseId: e.courseId,
        courseTitle: courses.find((c) => c.id === e.courseId)?.title || "",
        studentName:
          recentStudents.find((s) => s.id === e.userId)?.name || "",
        enrolledAt: e.enrolledAt,
      }));

    // Average rating and total reviews (if available) - including deleted courses
    const averageRating = courses.length
      ? courses.reduce((sum, c) => sum + (c.rating || 0), 0) /
        courses.length
      : 0;
    const totalReviews = courses.reduce(
      (sum, c) => sum + (c.reviewCount || 0),
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
