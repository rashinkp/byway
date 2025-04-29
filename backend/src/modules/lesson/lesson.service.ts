// src/modules/lesson/lesson.service.ts
import { PrismaClient } from "@prisma/client";
import { CourseRepository } from "../course/course.repository";
import {
  ILesson,
  ICreateLessonInput,
  IUserLessonProgress,
  IUpdateLessonProgressInput,
  IGetProgressInput,
  IGetAllLessonsInput,
  IGetAllLessonsResponse,
} from "./lesson.types";
import { ILessonRepository } from "./lesson.repository.types";

export class LessonService {
  constructor(
    private lessonRepository: ILessonRepository,
    private courseRepository: CourseRepository,
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

    const where = {
      courseId: input.courseId,
      order: input.order,
      deletedAt: null,
    };
    const existingLesson = await this.lessonRepository.findLessonByWhere(where);
    if (existingLesson) {
      throw new Error("A lesson with this order already exists in the course");
    }
    return this.lessonRepository.createLesson(input);
  }

  async getAllLessons(
    input: IGetAllLessonsInput
  ): Promise<IGetAllLessonsResponse> {
    const { courseId, userId } = input;

    // Check if user is enrolled or the course creator
    const course = await this.courseRepository.getCourseById(courseId);
    if (!course || (course.deletedAt && !input.includeDeleted)) {
      throw new Error("Course not found or deleted");
    }

    const isCreator = course.createdBy === userId;
    const enrollment = await this.courseRepository.getEnrollment(
      userId,
      courseId
    );

    if (!isCreator && !enrollment) {
      throw new Error("You are not enrolled in this course or not the creator");
    }

    return this.lessonRepository.getAllLessons(input);
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

    // Check prerequisite using repository
    if (completed && lesson.order > 1) {
      const previousProgress =
        await this.lessonRepository.getPreviousLessonProgress(
          userId,
          courseId,
          lesson.order
        );
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

  async getLessonById(lessonId: string): Promise<ILesson | null> {
    return this.lessonRepository.getLessonById(lessonId);
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const lesson = await this.lessonRepository.getLessonById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    await this.lessonRepository.deleteLesson(lessonId);
  }

  async updateLesson(
    lessonId: string,
    input: Partial<ICreateLessonInput>
  ): Promise<ILesson> {
    const lesson = await this.lessonRepository.getLessonById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    let courseId = lesson.courseId;
    let inputOrder = input.order;

    const where = {
      courseId,
      order: inputOrder,
      id: { not: lessonId },
    };

    const existingLesson = await this.lessonRepository.findLessonByWhere(where);

    if (existingLesson) {
      throw new Error("A lesson with this order already exists in the course");
    }

    const updatedLesson = await this.lessonRepository.updateLesson(
      lessonId,
      input
    );
    if (!updatedLesson) {
      throw new Error("Failed to update lesson");
    }
    return updatedLesson;
  }
}
