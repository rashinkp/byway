// src/modules/lesson/lesson.repository.ts
import { PrismaClient } from "@prisma/client";
import {
  ILesson,
  ICreateLessonInput,
  IUserLessonProgress,
  IUpdateLessonProgressInput,
  IGetProgressInput,
  ILessonRepository,
} from "./lesson.types";



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
      thumbnail: lesson.thumbnail || undefined,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      deletedAt: lesson.deletedAt || undefined,
    };
  }

  async getLessonById(id: string): Promise<ILesson | null> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id, deletedAt: null },
    });
    if (!lesson) return null;
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description || undefined,
      order: lesson.order,
      thumbnail: lesson.thumbnail || undefined,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      deletedAt: lesson.deletedAt || undefined,
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
      description: lesson.description || undefined,
      order: lesson.order,
      thumbnail: lesson.thumbnail || undefined,
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


  
}
