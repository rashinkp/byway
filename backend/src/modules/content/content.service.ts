import { PrismaClient } from "@prisma/client";
import { LessonRepository } from "../lesson/lesson.repository";
import {
  IContentRepository,
  ICreateLessonContentInput,
  IUpdateLessonContentInput,
  ILessonContent,
} from "./content.types";

export class ContentService {
  constructor(
    private contentRepository: IContentRepository,
    private lessonRepository: LessonRepository,
    private prisma: PrismaClient
  ) {}

  async createContent(
    input: ICreateLessonContentInput,
    userId: string
  ): Promise<ILessonContent> {
    const { lessonId } = input;

    

    // Validate lesson exists and isn't deleted
    const lesson = await this.lessonRepository.getLessonById(lessonId);
    if (!lesson || lesson.deletedAt) {
      throw new Error("Lesson not found or deleted");
    }

    // Check if user is the course creator
    const course = await this.prisma.course.findUnique({
      where: { id: lesson.courseId },
    });
    if (!course || course.createdBy !== userId) {
      throw new Error(
        "Unauthorized: You can only add content to your own courses"
      );
    }

    // Check if content already exists for this lesson
    const existingContent = await this.contentRepository.getContentByLessonId(
      lessonId
    );
    if (existingContent && !existingContent.deletedAt) {
      throw new Error("Content already exists for this lesson");
    }

    return this.contentRepository.createContent(input);
  }

  async getContentByLessonId(
    lessonId: string,
    userId: string
  ): Promise<ILessonContent | null> {
    const lesson = await this.lessonRepository.getLessonById(lessonId);
    if (!lesson || lesson.deletedAt) {
      throw new Error("Lesson not found or deleted");
    }

    // Check if user is enrolled or the course creator
    const course = await this.prisma.course.findUnique({
      where: { id: lesson.courseId },
    });
    if (!course) {
      throw new Error("Course not found");
    }
    const isCreator = course.createdBy === userId;
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: lesson.courseId } },
    });
    if (!isCreator && !enrollment) {
      throw new Error("You are not enrolled in this course or not the creator");
    }

    return this.contentRepository.getContentByLessonId(lessonId);
  }

  async updateContent(
    id: string,
    input: IUpdateLessonContentInput,
    userId: string
  ): Promise<ILessonContent> {
    const content = await this.contentRepository.getContentByLessonId(
      input.lessonId || ""
    );

    if (!content || content.deletedAt) {
      throw new Error("Content not found or deleted");
    }

    const lesson = await this.lessonRepository.getLessonById(content.lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const course = await this.prisma.course.findUnique({
      where: { id: lesson.courseId },
    });
    if (!course || course.createdBy !== userId) {
      throw new Error(
        "Unauthorized: You can only update content for your own courses"
      );
    }

    return this.contentRepository.updateContent({...input });
  }

  async deleteContent(id: string, userId: string): Promise<ILessonContent> {
    const content = await this.contentRepository.getContentByLessonId(id);
    if (!content || content.deletedAt) {
      throw new Error("Content not found or already deleted");
    }

    const lesson = await this.lessonRepository.getLessonById(content.lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const course = await this.prisma.course.findUnique({
      where: { id: lesson.courseId },
    });
    if (!course || course.createdBy !== userId) {
      throw new Error(
        "Unauthorized: You can only delete content for your own courses"
      );
    }

    return this.contentRepository.deleteContent(id);
  }
}
