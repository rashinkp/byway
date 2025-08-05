import { PrismaClient, Prisma } from "@prisma/client";
import { LessonRecord } from "../../app/records/lesson.record";
import { ILessonRepository } from "../../app/repositories/lesson.repository";

export class LessonRepository implements ILessonRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(lesson: LessonRecord): Promise<LessonRecord> {
    try {
      const saved = await this.prisma.lesson.create({
        data: {
          id: lesson.id,
          courseId: lesson.courseId,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          status: lesson.status as any,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
          deletedAt: lesson.deletedAt,
        },
      });

      return this.mapToLessonRecord(saved);
    } catch (error) {
      throw new Error(`Failed to save lesson: ${error}`);
    }
  }

  async findById(id: string): Promise<LessonRecord | null> {
    try {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id },
      });

      return lesson ? this.mapToLessonRecord(lesson) : null;
    } catch (error) {
      throw new Error(`Failed to find lesson by id: ${error}`);
    }
  }

  async findByCourseId(courseId: string): Promise<LessonRecord[]> {
    try {
      const lessons = await this.prisma.lesson.findMany({
        where: { courseId, deletedAt: null },
        orderBy: { order: "asc" },
      });

      return lessons.map(lesson => this.mapToLessonRecord(lesson));
    } catch (error) {
      throw new Error(`Failed to find lessons by course id: ${error}`);
    }
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    includeDeleted?: boolean;
    search?: string;
    courseId?: string;
  }): Promise<{ lessons: LessonRecord[]; total: number; totalPages: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "order",
        sortOrder = "asc",
        includeDeleted = false,
        search,
        courseId,
      } = options;

      const skip = (page - 1) * limit;
      const where: Prisma.LessonWhereInput = {
        ...(courseId ? { courseId } : {}),
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      };

      const [lessons, total] = await Promise.all([
        this.prisma.lesson.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        this.prisma.lesson.count({ where }),
      ]);

      return {
        lessons: lessons.map(lesson => this.mapToLessonRecord(lesson)),
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to find all lessons: ${error}`);
    }
  }

  async getPublicLessons(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    courseId?: string;
  }): Promise<{ lessons: LessonRecord[]; total: number; totalPages: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "order",
        sortOrder = "asc",
        search,
        courseId,
      } = options;

      const skip = (page - 1) * limit;
      const where: Prisma.LessonWhereInput = {
        ...(courseId ? { courseId } : {}),
        status: "PUBLISHED",
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      };

      const [lessons, total] = await Promise.all([
        this.prisma.lesson.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        this.prisma.lesson.count({ where }),
      ]);

      return {
        lessons: lessons.map(lesson => this.mapToLessonRecord(lesson)),
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to get public lessons: ${error}`);
    }
  }

  async update(lesson: LessonRecord): Promise<LessonRecord> {
    try {
      const updated = await this.prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          status: lesson.status as any,
          updatedAt: lesson.updatedAt,
          deletedAt: lesson.deletedAt,
        },
      });

      return this.mapToLessonRecord(updated);
    } catch (error) {
      throw new Error(`Failed to update lesson: ${error}`);
    }
  }

  async softDelete(lesson: LessonRecord): Promise<LessonRecord> {
    try {
      const updated = await this.prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return this.mapToLessonRecord(updated);
    } catch (error) {
      throw new Error(`Failed to soft delete lesson: ${error}`);
    }
  }

  async hasPublishedLessons(courseId: string): Promise<boolean> {
    try {
      const count = await this.prisma.lesson.count({
        where: {
          courseId,
          status: "PUBLISHED",
          deletedAt: null,
        },
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check published lessons: ${error}`);
    }
  }

  private mapToLessonRecord(prismaLesson: any): LessonRecord {
    return {
      id: prismaLesson.id,
      courseId: prismaLesson.courseId,
      title: prismaLesson.title,
      description: prismaLesson.description,
      order: prismaLesson.order,
      status: prismaLesson.status,
      createdAt: prismaLesson.createdAt,
      updatedAt: prismaLesson.updatedAt,
      deletedAt: prismaLesson.deletedAt,
    };
  }
}
