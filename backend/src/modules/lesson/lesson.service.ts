// src/modules/lesson/lesson.service.ts
import { PrismaClient } from "@prisma/client";
import { CourseRepository } from "../course/course.repository";
import {
  ILesson,
  ICreateLessonInput,
  IUserLessonProgress,
  IUpdateLessonProgressInput,
  IGetProgressInput,
  ILessonRepository,
} from "./lesson.types";

export class LessonService {
  constructor(
    private lessonRepository: ILessonRepository,
    private courseRepository: CourseRepository,
    private prisma: PrismaClient
  ) {}

  async createLesson(
    input: ICreateLessonInput,
    userId: string
  ): Promise<ILesson> {
    if (
      !input.courseId ||
      !input.title ||
      typeof input.order !== "number" ||
      input.order < 1
    ) {
      throw new Error("Course ID, title, and positive order are required");
    }

    // console.log(input , userId)

    const course = await this.courseRepository.getCourseById(input.courseId);
    if (!course || course.deletedAt) {
      throw new Error("Course not found or deleted");
    }
    if (course.createdBy !== userId) {
      // Check role instead of ID
      throw new Error(
        "Unauthorized: You can only add lessons to your own courses"
      );
    }
    const existingLesson = await this.prisma.lesson.findFirst({
      where: { courseId: input.courseId, order: input.order, deletedAt: null },
    });
    if (existingLesson) {
      throw new Error("A lesson with this order already exists in the course");
    }
    return this.lessonRepository.createLesson(input);
  }

  async updateLessonProgress(
    input: IUpdateLessonProgressInput
  ): Promise<IUserLessonProgress> {
    const { userId, courseId, lessonId, completed } = input;

    // Validate input
    if (typeof completed !== "boolean") {
      throw new Error("Completed must be a boolean");
    }

    const enrollment = await this.courseRepository.getEnrollment(
      userId,
      courseId
    );
    if (!enrollment) {
      throw new Error("You are not enrolled in this course");
    }

    const lesson = await this.lessonRepository.getLessonById(lessonId);
    if (!lesson || lesson.courseId !== courseId || lesson.deletedAt) {
      throw new Error("Lesson not found, deleted, or not part of this course");
    }

    // Optimize prerequisite check
    if (completed && lesson.order > 1) {
      const previousProgress = await this.prisma.userLessonProgress.findFirst({
        where: {
          userId,
          courseId,
          lesson: { order: lesson.order - 1, deletedAt: null },
        },
      });
      if (!previousProgress || !previousProgress.completed) {
        throw new Error("You must complete the previous lesson first");
      }
    }

    return this.lessonRepository.updateLessonProgress(input);
  }

  async getCourseProgress(
    input: IGetProgressInput
  ): Promise<IUserLessonProgress[]> {
    const { userId, courseId } = input;
    const enrollment = await this.courseRepository.getEnrollment(
      userId,
      courseId
    );
    if (!enrollment) {
      throw new Error("You are not enrolled in this course");
    }
    return this.lessonRepository.getCourseProgress(input);
  }
}
