import { PrismaClient } from "@prisma/client";
import { ContentStatus, ContentType } from "../../domain/enum/content.enum";
import { LessonContent, QuizQuestion } from "../../domain/entities/lesson-content.entity";
import { ILessonContentRepository } from "../../app/repositories/content.repository";

export class LessonContentRepository implements ILessonContentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<LessonContent | null> {
    const content = await this.prisma.lessonContent.findUnique({
      where: { id, deletedAt: null }, // Only return non-soft-deleted content
      include: { quizQuestions: true },
    });

    if (!content) {
      return null;
    }

    return LessonContent.fromPersistence({
      id: content.id,
      lessonId: content.lessonId,
      type: content.type as ContentType,
      status: content.status as ContentStatus,
      title: content.title,
      description: content.description,
      fileUrl: content.fileUrl,
      thumbnailUrl: content.thumbnailUrl,
      quizQuestions: content.quizQuestions
        ? content.quizQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }))
        : null,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt,
    });
  }

  async findByLessonId(lessonId: string): Promise<LessonContent | null> {
    const content = await this.prisma.lessonContent.findUnique({
      where: { lessonId },
      include: { quizQuestions: true },
    });

    if (!content) {
      return null;
    }

    return LessonContent.fromPersistence({
      id: content.id,
      lessonId: content.lessonId,
      type: content.type as ContentType,
      status: content.status as ContentStatus,
      title: content.title,
      description: content.description,
      fileUrl: content.fileUrl,
      thumbnailUrl: content.thumbnailUrl,
      quizQuestions: content.quizQuestions
        ? content.quizQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }))
        : null,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt,
    });
  }

  async create(content: LessonContent): Promise<LessonContent> {
    const contentData = content.toJSON();

    const createdContent = await this.prisma.lessonContent.create({
      data: {
        id: contentData.id,
        lessonId: contentData.lessonId,
        type: contentData.type,
        status: contentData.status,
        title: contentData.title,
        description: contentData.description,
        fileUrl: contentData.fileUrl,
        thumbnailUrl: contentData.thumbnailUrl,
        quizQuestions: contentData.quizQuestions
          ? {
              create: contentData.quizQuestions.map((q: QuizQuestion) => ({
                id: q.id || undefined,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
              })),
            }
          : undefined,
        createdAt: new Date(contentData.createdAt),
        updatedAt: new Date(contentData.updatedAt),
        deletedAt: contentData.deletedAt
          ? new Date(contentData.deletedAt)
          : null,
      },
      include: { quizQuestions: true },
    });

    return LessonContent.fromPersistence({
      id: createdContent.id,
      lessonId: createdContent.lessonId,
      type: createdContent.type as ContentType,
      status: createdContent.status as ContentStatus,
      title: createdContent.title,
      description: createdContent.description,
      fileUrl: createdContent.fileUrl,
      thumbnailUrl: createdContent.thumbnailUrl,
      quizQuestions: createdContent.quizQuestions
        ? createdContent.quizQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }))
        : null,
      createdAt: createdContent.createdAt,
      updatedAt: createdContent.updatedAt,
      deletedAt: createdContent.deletedAt,
    });
  }

  async update(content: LessonContent): Promise<LessonContent> {
    const contentData = content.toJSON();

    const updatedContent = await this.prisma.lessonContent.update({
      where: { id: contentData.id },
      data: {
        type: contentData.type,
        status: contentData.status,
        title: contentData.title,
        description: contentData.description,
        fileUrl: contentData.fileUrl,
        thumbnailUrl: contentData.thumbnailUrl,
        quizQuestions: contentData.quizQuestions
          ? {
              deleteMany: {},
              create: contentData.quizQuestions.map((q: QuizQuestion) => ({
                id: q.id || undefined,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
              })),
            }
          : { deleteMany: {} },
        updatedAt: new Date(contentData.updatedAt),
        deletedAt: contentData.deletedAt
          ? new Date(contentData.deletedAt)
          : null,
      },
      include: { quizQuestions: true },
    });

    return LessonContent.fromPersistence({
      id: updatedContent.id,
      lessonId: updatedContent.lessonId,
      type: updatedContent.type as ContentType,
      status: updatedContent.status as ContentStatus,
      title: updatedContent.title,
      description: updatedContent.description,
      fileUrl: updatedContent.fileUrl,
      thumbnailUrl: updatedContent.thumbnailUrl,
      quizQuestions: updatedContent.quizQuestions
        ? updatedContent.quizQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }))
        : null,
      createdAt: updatedContent.createdAt,
      updatedAt: updatedContent.updatedAt,
      deletedAt: updatedContent.deletedAt,
    });
  }


  async delete(id: string): Promise<void> {
    await this.prisma.lessonContent.delete({
      where: { id },
    });
  }
}