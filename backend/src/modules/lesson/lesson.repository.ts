// src/modules/lesson/lesson.repository.ts
import { PrismaClient } from "@prisma/client";
import {
  ILesson,
  ICreateLessonInput,
  IUserLessonProgress,
  IUpdateLessonProgressInput,
  IGetProgressInput,
  IGetAllLessonsInput,
  IGetAllLessonsResponse,
} from "./lesson.types";
import { ILessonRepository } from "./lesson.repository.interface";

export class LessonRepository implements ILessonRepository {
  constructor(private prisma: PrismaClient) {}

  async createLesson(input: ICreateLessonInput): Promise<ILesson> {
    const lesson = await this.prisma.lesson.create({
      data: input,
    });
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description || undefined,
      order: lesson.order,
      status: lesson.status,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      deletedAt: lesson.deletedAt || undefined,
    };
  }

  async getAllLessons(
    input: IGetAllLessonsInput
  ): Promise<IGetAllLessonsResponse> {
    const {
      courseId,
      page = 1,
      limit = 10,
      sortBy = "order",
      sortOrder = "asc",
      search = "",
      filterBy = "ALL",
      includeDeleted = false,
    } = input;

    // Build where clause
    const where: any = {
      courseId,
      ...(filterBy !== "ALL" ? { status: filterBy } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(includeDeleted ? {} : { deletedAt: null }),
    };

    // Fetch lessons with pagination
    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        courseId: lesson.courseId,
        title: lesson.title,
        description: lesson.description || undefined,
        order: lesson.order,
        status: lesson.status,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        deletedAt: lesson.deletedAt || undefined,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getLessonById(lessonId: string): Promise<ILesson | null> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        content: true,
      },
    });
    if (!lesson) return null;
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description || undefined,
      order: lesson.order,
      status: lesson.status,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      deletedAt: lesson.deletedAt || undefined,
      content: lesson.content || undefined,
    };
  }

  async getLessonsByCourseId(courseId: string): Promise<ILesson[]> {
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId, deletedAt: null },
      orderBy: { order: "asc" },
    });
    return lessons.map((lesson) => ({
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      status: lesson.status,
      description: lesson.description || undefined,
      order: lesson.order,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      deletedAt: lesson.deletedAt || undefined,
    }));
  }

  async updateLessonProgress(
    input: IUpdateLessonProgressInput
  ): Promise<IUserLessonProgress> {
    const { userId, courseId, lessonId, completed } = input;
    const progress = await this.prisma.userLessonProgress.upsert({
      where: { userId_courseId_lessonId: { userId, courseId, lessonId } },
      create: {
        userId,
        courseId,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date(),
      },
    });
    return {
      userId: progress.userId,
      courseId: progress.courseId,
      lessonId: progress.lessonId,
      completed: progress.completed,
      completedAt: progress.completedAt || undefined,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }

  async getCourseProgress(
    input: IGetProgressInput
  ): Promise<IUserLessonProgress[]> {
    const { userId, courseId } = input;
    const progress = await this.prisma.userLessonProgress.findMany({
      where: { userId, courseId },
      orderBy: { lesson: { order: "asc" } },
    });
    return progress.map((p) => ({
      userId: p.userId,
      courseId: p.courseId,
      lessonId: p.lessonId,
      completed: p.completed,
      completedAt: p.completedAt || undefined,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  async updateLesson(
    lessonId: string,
    input: Partial<ICreateLessonInput>
  ): Promise<ILesson> {
    return this.prisma.lesson
      .update({
        where: { id: lessonId },
        data: input,
      })
      .then((lesson) => ({
        id: lesson.id,
        courseId: lesson.courseId,
        title: lesson.title,
        description: lesson.description || undefined,
        order: lesson.order,
        status: lesson.status,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        deletedAt: lesson.deletedAt || undefined,
      }));
  }

  async deleteLesson(lessonId: string): Promise<void> {
    await this.prisma.lesson.delete({
      where: { id: lessonId },
    });
  }

  async findLessonByWhere(where: any): Promise<ILesson | null> {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        ...where,
      },
    });
    if (!lesson) return null;
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description || undefined,
      order: lesson.order,
      status: lesson.status,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      deletedAt: lesson.deletedAt || undefined,
    };
  }

  async getPreviousLessonProgress(
    userId: string,
    courseId: string,
    lessonOrder: number
  ): Promise<IUserLessonProgress | null> {
    const previousProgress = await this.prisma.userLessonProgress.findFirst({
      where: {
        userId,
        courseId,
        lesson: { order: lessonOrder - 1, deletedAt: null },
      },
    });

    if (!previousProgress) return null;

    return {
      userId: previousProgress.userId,
      courseId: previousProgress.courseId,
      lessonId: previousProgress.lessonId,
      completed: previousProgress.completed,
      completedAt: previousProgress.completedAt || undefined,
      createdAt: previousProgress.createdAt,
      updatedAt: previousProgress.updatedAt,
    };
  }
}
