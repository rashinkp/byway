import { PrismaClient } from "@prisma/client";
import { LessonProgress } from "../../domain/entities/lesson-progress.entity";
import { ILessonProgressRepository } from "../../app/repositories/lesson-progress.repository.interface";
import { HttpError } from "../../presentation/http/errors/http-error";

export class LessonProgressRepository implements ILessonProgressRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(progress: LessonProgress): Promise<LessonProgress> {
    try {
      const saved = await this.prisma.lessonProgress.create({
        data: {
          id: progress.id,
          enrollmentId: progress.enrollmentId,
          courseId: progress.courseId,
          lessonId: progress.lessonId,
          completed: progress.completed,
          completedAt: progress.completedAt,
          createdAt: progress.createdAt,
          updatedAt: progress.updatedAt,
        },
      });

      return LessonProgress.fromPersistence({
        id: saved.id,
        enrollmentId: saved.enrollmentId,
        courseId: saved.courseId,
        lessonId: saved.lessonId,
        completed: saved.completed,
        completedAt: saved.completedAt,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      });
    } catch (error) {
      console.error("Error saving lesson progress:", error);
      throw new HttpError("Failed to save lesson progress", 500);
    }
  }

  async findByEnrollmentAndLesson(
    enrollmentId: string,
    courseId: string,
    lessonId: string
  ): Promise<LessonProgress | null> {
    try {
      const progress = await this.prisma.lessonProgress.findUnique({
        where: {
          enrollmentId_courseId_lessonId: {
            enrollmentId,
            courseId,
            lessonId,
          },
        },
      });

      if (!progress) {
        return null;
      }

      return LessonProgress.fromPersistence({
        id: progress.id,
        enrollmentId: progress.enrollmentId,
        courseId: progress.courseId,
        lessonId: progress.lessonId,
        completed: progress.completed,
        completedAt: progress.completedAt,
        createdAt: progress.createdAt,
        updatedAt: progress.updatedAt,
      });
    } catch (error) {
      console.error("Error finding lesson progress:", error);
      throw new HttpError("Failed to find lesson progress", 500);
    }
  }

  async findByEnrollment(
    enrollmentId: string,
    courseId: string
  ): Promise<LessonProgress[]> {
    try {
      const progress = await this.prisma.lessonProgress.findMany({
        where: {
          enrollmentId,
          courseId,
        },
      });

      return progress.map((p) =>
        LessonProgress.fromPersistence({
          id: p.id,
          enrollmentId: p.enrollmentId,
          courseId: p.courseId,
          lessonId: p.lessonId,
          completed: p.completed,
          completedAt: p.completedAt,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })
      );
    } catch (error) {
      console.error("Error finding lesson progress:", error);
      throw new HttpError("Failed to find lesson progress", 500);
    }
  }

  async update(progress: LessonProgress): Promise<LessonProgress> {
    try {
      const updated = await this.prisma.lessonProgress.update({
        where: {
          id: progress.id,
        },
        data: {
          completed: progress.completed,
          completedAt: progress.completedAt,
          updatedAt: progress.updatedAt,
        },
      });

      return LessonProgress.fromPersistence({
        id: updated.id,
        enrollmentId: updated.enrollmentId,
        courseId: updated.courseId,
        lessonId: updated.lessonId,
        completed: updated.completed,
        completedAt: updated.completedAt,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      });
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      throw new HttpError("Failed to update lesson progress", 500);
    }
  }

  async calculateCourseProgress(
    enrollmentId: string,
    courseId: string
  ): Promise<number> {
    try {
      const [totalLessons, completedLessons] = await Promise.all([
        this.prisma.lesson.count({
          where: {
            courseId,
            deletedAt: null,
          },
        }),
        this.prisma.lessonProgress.count({
          where: {
            enrollmentId,
            courseId,
            completed: true,
          },
        }),
      ]);

      if (totalLessons === 0) {
        return 0;
      }

      return Math.round((completedLessons / totalLessons) * 100);
    } catch (error) {
      console.error("Error calculating course progress:", error);
      throw new HttpError("Failed to calculate course progress", 500);
    }
  }
} 