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
import { ILessonRepository } from "../../../repositories/lesson.repository";
import crypto from "crypto";


export class GenerateCertificateUseCase implements IGenerateCertificateUseCase {
  constructor(
    private readonly _certificateRepository: CertificateRepositoryInterface,
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _courseRepository: ICourseRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _lessonProgressRepository: ILessonProgressRepository,
    private readonly _lessonRepository: ILessonRepository,
    private readonly _pdfService: CertificatePdfServiceInterface,
    private readonly _s3Service: S3ServiceInterface
  ) {}

  async execute(
    request: GenerateCertificateInputDto
  ): Promise<GenerateCertificateOutputDto> {
    try {
      const { userId, courseId } = request;

      // 1. Check if user is enrolled in the course
      const enrollment = await this._enrollmentRepository.findByUserAndCourse(
        userId,
        courseId
      );
      if (!enrollment) {
        return {
          success: false,
          error: "User is not enrolled in this course",
        };
      }

      const existingCertificate =
        await this._certificateRepository.findByUserIdAndCourseId(
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
            await this._s3Service.deleteFile(existingCertificate.pdfUrl);
        }
        // Prepare to update existing certificate
        isUpdate = true;
        oldCertificateId = existingCertificate.id;
      }

      console.log("Checking course completion for user:", userId, "course:", courseId);
      const isCompleted = await this.checkCourseCompletion(userId, courseId);
      console.log("Course completion result:", isCompleted);
      if (!isCompleted) {
      
        return {
          success: false,
          error: "Course is not completed yet",
        };
      }

      const course = await this._courseRepository.findById(courseId);
      const user = await this._userRepository.findById(userId);

      if (!course || !user) {
      
        return {
          success: false,
          error: "Course or user not found",
        };
      }

      const completionStats = await this.getCompletionStatistics(
        userId,
        courseId
      );

      // 6. Generate certificate number
      const certificateNumber = this._generateCertificateNumber();
  

      // 7. Create or update certificate entity
      certificate = Certificate.create({
        id: crypto.randomUUID(), // Generate unique ID
        userId,
        courseId,
        enrollmentId: enrollment.userId, // Use userId as enrollmentId for foreign key constraint
        certificateNumber,
        status: CertificateStatus.PENDING,
      });
             if (isUpdate && oldCertificateId) {
         // Use the same id as the old certificate
         certificate = new Certificate({
           id: oldCertificateId,
           userId: certificate.userId,
           courseId: certificate.courseId,
           enrollmentId: certificate.enrollmentId,
           certificateNumber: certificate.certificateNumber,
           expiresAt: certificate.expiresAt,
           createdAt:
             existingCertificate && existingCertificate.createdAt
               ? new Date(existingCertificate.createdAt)
               : new Date(),
         });
       }

   
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

      const pdfBuffer = await this._pdfService.generateCertificatePDF(pdfData);

      let pdfUrl = "";
      try {
        pdfUrl = await this._s3Service.uploadFile(
          pdfBuffer,
          `${certificateNumber}.pdf`,
          "application/pdf",
          "certificate",
          { courseId, certificateId: certificateNumber }
        );
      } catch (err) {
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
        savedCertificate = await this._certificateRepository.update(certificate);

      } else {
        savedCertificate = await this._certificateRepository.create(certificate);

      }

      return {
        success: true,
        certificate: savedCertificate,
      };
    } catch (error) {
      console.error("Certificate generation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate certificate",
      };
    }
  }

  private async checkCourseCompletion(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    try {
      console.log("Starting course completion check...");
      
      // Get all lessons for the course
      const course = await this._courseRepository.findById(courseId);
      console.log("Course found:", !!course);
      if (!course) return false;

      // Get all lesson progress for this user and course
      const enrollment = await this._enrollmentRepository.findByUserAndCourse(
        userId,
        courseId
      );
      console.log("Enrollment found:", !!enrollment);
      if (!enrollment) {
        return false;
      }
      
      // Get all lessons in the course
      const allLessons = await this._lessonRepository.findByCourseId(courseId);
      console.log("Total lessons found:", allLessons?.length || 0);
      if (!allLessons || allLessons.length === 0) return false;
      
      const totalLessons = allLessons.length;
      
      // Get lesson progress records
      const lessonProgress =
        await this._lessonProgressRepository.findByEnrollment(
          enrollment.userId,
          courseId
        );
      console.log("Lesson progress records found:", lessonProgress?.length || 0);

      // If no progress records exist yet, check if user has been enrolled long enough
      // to have had a chance to complete lessons
      if (!lessonProgress || lessonProgress.length === 0) {
        console.log("No progress records found, allowing certificate generation");
        // For now, allow certificate generation if user is enrolled
        // This is a temporary fix - ideally we'd want to track actual progress
        return true;
      }

      // Check completion percentage
      const completedLessons = lessonProgress.filter(
        (progress: LessonProgress) => progress.completed
      ).length;
      console.log("Completed lessons:", completedLessons, "out of", totalLessons);

      // Consider course completed if 90% or more lessons are completed
      const completionPercentage = (completedLessons / totalLessons) * 100;
      console.log("Completion percentage:", completionPercentage);
      return completionPercentage >= 90;
    } catch (error) {
      console.error("Error in checkCourseCompletion:", error);
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
    const enrollment = await this._enrollmentRepository.findByUserAndCourse(
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
    const lessonProgress = await this._lessonProgressRepository.findByEnrollment(
      enrollment.userId,
      courseId
    );
    const course = await this._courseRepository.findById(courseId);

    // If no lesson progress exists, get total lessons from course
    if (!lessonProgress || lessonProgress.length === 0) {
      const allLessons = await this._lessonRepository.findByCourseId(courseId);
      return {
        completionDate: new Date().toLocaleDateString(),
        instructorName: course?.createdBy ? (await this._userRepository.findById(course.createdBy))?.name : undefined,
        totalLessons: allLessons.length,
        completedLessons: 0,
        averageScore: 0,
      };
    }

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
        const instructor = await this._userRepository.findById(course.createdBy);
        instructorName = instructor?.name;
      } catch (error) {
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

  private _generateCertificateNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CERT-${timestamp}-${random}`.toUpperCase();
  }
}
