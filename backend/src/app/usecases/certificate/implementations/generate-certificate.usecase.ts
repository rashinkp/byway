import { CertificateRepositoryInterface } from "../../../repositories/certificate-repository.interface";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { ICourseRepository } from "../../../repositories/course.repository.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { ILessonProgressRepository } from "../../../repositories/lesson-progress.repository.interface";
import { Certificate } from "../../../../domain/entities/certificate.entity";
import { CertificateStatus } from "../../../../domain/enum/certificate-status.enum";
import { LessonProgress } from "../../../../domain/entities/progress.entity";
import {
  IGenerateCertificateUseCase,
} from "../interfaces/generate-certificate.usecase.interface";
import { CertificatePdfServiceInterface } from "../../../providers/generate-certificate.interface";
import { S3ServiceInterface } from "../../../providers/s3.service.interface";
import { GenerateCertificateInputDto, GenerateCertificateOutputDto } from "../../../dtos/certificate.dto";


export class GenerateCertificateUseCase implements IGenerateCertificateUseCase {
  constructor(
    private readonly certificateRepository: CertificateRepositoryInterface,
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly userRepository: IUserRepository,
    private readonly lessonProgressRepository: ILessonProgressRepository,
    private readonly pdfService: CertificatePdfServiceInterface,
    private readonly s3Service: S3ServiceInterface
  ) {}

  async execute(
    request: GenerateCertificateInputDto
  ): Promise<GenerateCertificateOutputDto> {
    try {
      const { userId, courseId } = request;
      console.log(
        `[Certificate] Searching for enrollment: userId=${userId}, courseId=${courseId}`
      );

      // 1. Check if user is enrolled in the course
      const enrollment = await this.enrollmentRepository.findByUserAndCourse(
        userId,
        courseId
      );
      if (!enrollment) {
        console.log(
          `[Certificate] Enrollment not found for userId=${userId}, courseId=${courseId}`
        );
        return {
          success: false,
          error: "User is not enrolled in this course",
        };
      }

      // 2. Check if certificate already exists
      console.log(
        `[Certificate] Checking for existing certificate: userId=${userId}, courseId=${courseId}`
      );
      const existingCertificate =
        await this.certificateRepository.findByUserIdAndCourseId(
          userId,
          courseId
        );
      let certificate;
      let isUpdate = false;
      let oldCertificateId = undefined;
      if (existingCertificate) {
        // Restrict regeneration to once every 30 days
        const lastUpdated = new Date(existingCertificate.updatedAt);
        const now = new Date();
        const daysSinceUpdate =
          (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 30) {
          return {
            success: false,
            error: `Certificate can only be regenerated once every 30 days. Please try again after ${Math.ceil(
              30 - daysSinceUpdate
            )} day(s).`,
          };
        }
        // Delete from S3 if pdfUrl exists
        if (existingCertificate.pdfUrl) {
          try {
            await this.s3Service.deleteFile(existingCertificate.pdfUrl);
            console.log(
              `[Certificate] Deleted old certificate PDF from S3: ${existingCertificate.pdfUrl}`
            );
          } catch (err) {
            console.error(
              `[Certificate] Failed to delete old certificate PDF from S3:`,
              err
            );
          }
        }
        // Prepare to update existing certificate
        isUpdate = true;
        oldCertificateId = existingCertificate.id;
      }

      // 3. Check if course is completed
      console.log(
        `[Certificate] Checking course completion for userId=${userId}, courseId=${courseId}`
      );
      const isCompleted = await this.checkCourseCompletion(userId, courseId);
      if (!isCompleted) {
        console.log(
          `[Certificate] Course not completed for userId=${userId}, courseId=${courseId}`
        );
        return {
          success: false,
          error: "Course is not completed yet",
        };
      }

      // 4. Get course and user details
      console.log(
        `[Certificate] Fetching course and user details: userId=${userId}, courseId=${courseId}`
      );
      const course = await this.courseRepository.findById(courseId);
      const user = await this.userRepository.findById(userId);

      if (!course || !user) {
        console.log(
          `[Certificate] Course or user not found: userId=${userId}, courseId=${courseId}`
        );
        return {
          success: false,
          error: "Course or user not found",
        };
      }

      // 5. Get completion statistics
      console.log(
        `[Certificate] Calculating completion statistics: userId=${userId}, courseId=${courseId}`
      );
      const completionStats = await this.getCompletionStatistics(
        userId,
        courseId
      );

      // 6. Generate certificate number
      const certificateNumber = this.generateCertificateNumber();
      console.log(
        `[Certificate] Generating certificate: certificateNumber=${certificateNumber}`
      );

      // 7. Create or update certificate entity
      certificate = Certificate.create({
        userId,
        courseId,
        enrollmentId: enrollment.userId, // This should be the enrollment ID
        certificateNumber,
        status: CertificateStatus.PENDING,
      });
      if (isUpdate && oldCertificateId) {
        // Use the same id as the old certificate
        certificate = new Certificate({
          userId: certificate.userId,
          courseId: certificate.courseId,
          enrollmentId: certificate.enrollmentId,
          certificateNumber: certificate.certificateNumber,
          expiresAt: certificate.expiresAt,
          id: oldCertificateId,
          createdAt:
            existingCertificate && existingCertificate.createdAt
              ? new Date(existingCertificate.createdAt)
              : new Date(),
        });
      }

      // 8. Generate PDF
      console.log(
        `[Certificate] Generating PDF for certificateNumber=${certificateNumber}`
      );
      const pdfData = {
        certificateNumber,
        studentName: user.name,
        courseTitle: course.title,
        completionDate: completionStats.completionDate,
        instructorName: completionStats.instructorName,
        totalLessons: completionStats.totalLessons,
        completedLessons: completionStats.completedLessons,
        averageScore: completionStats.averageScore,
        issuedDate: new Date().toLocaleDateString(),
      };

      const pdfBuffer = await this.pdfService.generateCertificatePDF(pdfData);

      // 9. Upload PDF to cloud storage
      console.log(
        `[Certificate] Uploading PDF to cloud for certificateNumber=${certificateNumber}`
      );
      let pdfUrl = "";
      try {
        pdfUrl = await this.s3Service.uploadFile(
          pdfBuffer,
          `${certificateNumber}.pdf`,
          "application/pdf",
          "certificate",
          { courseId, certificateId: certificateNumber }
        );
        console.log(`[Certificate] PDF uploaded successfully: url=${pdfUrl}`);
      } catch (err) {
        console.error(
          `[Certificate] PDF upload failed for certificateNumber=${certificateNumber}:`,
          err
        );
        return {
          success: false,
          error: "Failed to upload certificate PDF to cloud storage",
        };
      }

      // 10. Update certificate with PDF URL and metadata
      certificate.generateCertificate(pdfUrl, {
        completionStats,
        generatedAt: new Date().toISOString(),
      });

      // 11. Save certificate to database (update if exists, create if not)
      let savedCertificate;
      if (isUpdate && oldCertificateId) {
        savedCertificate = await this.certificateRepository.update(certificate);
        console.log(
          `[Certificate] Certificate updated in database: certificateNumber=${certificateNumber}`
        );
      } else {
        savedCertificate = await this.certificateRepository.create(certificate);
        console.log(
          `[Certificate] Certificate generation completed: certificateNumber=${certificateNumber}`
        );
      }

      return {
        success: true,
        certificate: savedCertificate,
      };
    } catch (error) {
      console.error("[Certificate] Error generating certificate:", error);
      return {
        success: false,
        error: "Failed to generate certificate",
      };
    }
  }

  private async checkCourseCompletion(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    try {
      // Get all lessons for the course
      const course = await this.courseRepository.findById(courseId);
      if (!course) return false;

      // Get all lesson progress for this user and course
      const enrollment = await this.enrollmentRepository.findByUserAndCourse(
        userId,
        courseId
      );
      if (!enrollment) {
        return false;
      }
      const lessonProgress =
        await this.lessonProgressRepository.findByEnrollment(
          enrollment.userId,
          courseId
        );

      if (!lessonProgress || lessonProgress.length === 0) return false;

      // Check if all lessons are completed
      const totalLessons = lessonProgress.length;
      const completedLessons = lessonProgress.filter(
        (progress: LessonProgress) => progress.completed
      ).length;

      // Consider course completed if 90% or more lessons are completed
      const completionPercentage = (completedLessons / totalLessons) * 100;
      return completionPercentage >= 90;
    } catch (error) {
      console.error("Error checking course completion:", error);
      return false;
    }
  }

  private async getCompletionStatistics(
    userId: string,
    courseId: string
  ): Promise<{
    completionDate: string;
    instructorName?: string;
    totalLessons: number;
    completedLessons: number;
    averageScore: number;
  }> {
    const enrollment = await this.enrollmentRepository.findByUserAndCourse(
      userId,
      courseId
    );
    if (!enrollment) {
      return {
        completionDate: "",
        totalLessons: 0,
        completedLessons: 0,
        averageScore: 0,
      };
    }
    const lessonProgress = await this.lessonProgressRepository.findByEnrollment(
      enrollment.userId,
      courseId
    );
    const course = await this.courseRepository.findById(courseId);

    const totalLessons = lessonProgress.length;
    const completedLessons = lessonProgress.filter(
      (progress: LessonProgress) => progress.completed
    ).length;

    // Calculate average score
    const scores = lessonProgress
      .filter((progress: LessonProgress) => progress.score !== undefined)
      .map((progress: LessonProgress) => progress.score!);

    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((sum: number, score: number) => sum + score, 0) /
              scores.length
          )
        : 0;

    // Get completion date (latest completed lesson date)
    const completedProgress = lessonProgress
      .filter(
        (progress: LessonProgress) => progress.completed && progress.completedAt
      )
      .sort(
        (a: LessonProgress, b: LessonProgress) =>
          new Date(b.completedAt!).getTime() -
          new Date(a.completedAt!).getTime()
      );

    const completionDate =
      completedProgress.length > 0
        ? new Date(completedProgress[0].completedAt!).toLocaleDateString()
        : new Date().toLocaleDateString();

    // Get instructor name if available
    let instructorName: string | undefined;
    if (course?.createdBy) {
      try {
        const instructor = await this.userRepository.findById(course.createdBy);
        instructorName = instructor?.name;
      } catch (error) {
        console.error("Error fetching instructor:", error);
      }
    }

    return {
      completionDate,
      instructorName,
      totalLessons,
      completedLessons,
      averageScore,
    };
  }

  private generateCertificateNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CERT-${timestamp}-${random}`.toUpperCase();
  }
}
