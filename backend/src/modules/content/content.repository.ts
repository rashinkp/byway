import { PrismaClient } from "@prisma/client";
import {
  ILessonContent,
  ICreateLessonContentInput,
  IUpdateLessonContentInput,
} from "./content.types";
import { IContentRepository } from "./content.repository.interface";

export class ContentRepository implements IContentRepository {
  constructor(private prisma: PrismaClient) {}

  async createContent(
    input: ICreateLessonContentInput
  ): Promise<ILessonContent> {
    const { quizQuestions, ...contentData } = input;

    const content = await this.prisma.lessonContent.create({
      data: {
        ...contentData,
        status: input.status || "DRAFT",
        quizQuestions:
          input.type === "QUIZ" && quizQuestions
            ? {
                create: quizQuestions.map((q) => ({
                  question: q.question,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                })),
              }
            : undefined,
      },
      include: {
        quizQuestions: true,
      },
    });

    return {
      id: content.id,
      lessonId: content.lessonId,
      type: content.type,
      status: content.status,
      title: content.title,
      description: content.description,
      fileUrl: content.fileUrl,
      thumbnailUrl: content.thumbnailUrl,
      quizQuestions: content.quizQuestions.map((q) => ({
        id: q.id,
        lessonContentId: q.lessonContentId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })),
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt || undefined,
    };
  }

  async getContentByLessonId(lessonId: string): Promise<ILessonContent | null> {
    const content = await this.prisma.lessonContent.findUnique({
      where: { lessonId },
      include: {
        quizQuestions: true,
      },
    });

    if (!content) return null;

    return {
      id: content.id,
      lessonId: content.lessonId,
      type: content.type,
      status: content.status,
      title: content.title,
      description: content.description,
      fileUrl: content.fileUrl,
      thumbnailUrl: content.thumbnailUrl,
      quizQuestions: content.quizQuestions.map((q) => ({
        id: q.id,
        lessonContentId: q.lessonContentId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })),
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt || undefined,
    };
  }

  async getContentById(id: string): Promise<ILessonContent | null> {
    const content = await this.prisma.lessonContent.findUnique({
      where: { id },
      include: {
        quizQuestions: true,
      },
    });

    if (!content) return null;

    return {
      id: content.id,
      lessonId: content.lessonId,
      type: content.type,
      status: content.status,
      title: content.title,
      description: content.description,
      fileUrl: content.fileUrl,
      thumbnailUrl: content.thumbnailUrl,
      quizQuestions: content.quizQuestions.map((q) => ({
        id: q.id,
        lessonContentId: q.lessonContentId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })),
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt || undefined,
    };
  }

  async updateContent(
    input: IUpdateLessonContentInput
  ): Promise<ILessonContent> {
    const { id, quizQuestions, ...contentData } = input;

    const content = await this.prisma.lessonContent.update({
      where: { id },
      data: {
        ...contentData,
        updatedAt: new Date(),
        quizQuestions:
          input.type === "QUIZ" && quizQuestions
            ? {
                deleteMany: {}, // Delete existing questions
                create: quizQuestions.map((q) => ({
                  question: q.question,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                })),
              }
            : undefined,
      },
      include: {
        quizQuestions: true,
      },
    });

    return {
      id: content.id,
      lessonId: content.lessonId,
      type: content.type,
      status: content.status,
      title: content.title,
      description: content.description,
      fileUrl: content.fileUrl,
      thumbnailUrl: content.thumbnailUrl,
      quizQuestions: content.quizQuestions.map((q) => ({
        id: q.id,
        lessonContentId: q.lessonContentId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })),
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt || undefined,
    };
  }

  async deleteContent(id: string): Promise<void> {
    await this.prisma.lessonContent.delete({
      where: { id },
    })
  }
}
