import {
  PrismaClient,
  Lesson as PrismaLesson,
  LessonContent as PrismaLessonContent,
} from "@prisma/client";
import {
  ILessonListOutputDTO,
  IGetAllLessonsInputDTO,
  IGetPublicLessonsInputDTO,
  IPublicLessonListOutputDTO,
  ILessonOutputDTO,
} from "../../domain/dtos/lesson/lesson.dto";
import { LessonStatus } from "../../domain/enum/lesson.enum";
import { ContentStatus, ContentType } from "../../domain/enum/content.enum";
import { ILessonRepository } from "../../app/repositories/lesson.repository";
import { Lesson } from "../../domain/entities/lesson.entity";
import {
  LessonContent,
  QuizQuestion,
} from "../../domain/entities/lesson-content.entity";

export class LessonRepository implements ILessonRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAllLessons(
    params: IGetAllLessonsInputDTO
  ): Promise<ILessonListOutputDTO> {
    const {
      courseId,
      page = 1,
      limit = 10,
      sortBy = "order",
      sortOrder = "asc",
      search,
      filterBy = "ALL",
      includeDeleted = false,
    } = params;

    const skip = (page - 1) * limit;
    const where: any = {
      courseId,
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(filterBy !== "ALL" && filterBy !== "INACTIVE"
        ? { status: filterBy }
        : filterBy === "INACTIVE"
        ? { deletedAt: { not: null } }
        : {}),
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
        include: { content: { include: { quizQuestions: true } } },
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      lessons: lessons.map(this.mapToLessonOutputDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPublicLessons(
    params: IGetPublicLessonsInputDTO
  ): Promise<IPublicLessonListOutputDTO> {
    const {
      courseId,
      page = 1,
      limit = 10,
      sortBy = "order",
      sortOrder = "asc",
      search,
    } = params;

    const skip = (page - 1) * limit;
    const where: any = {
      courseId,
      status: LessonStatus.PUBLISHED,
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
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
        },
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Lesson | null> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { content: { include: { quizQuestions: true } } },
    });

    if (!lesson) {
      return null;
    }

    return this.mapToLessonEntity(lesson);
  }

  async create(lesson: Lesson): Promise<Lesson> {
    const lessonData = lesson.toJSON();
    const contentData = lessonData.content;

    const createdLesson = await this.prisma.lesson.create({
      data: {
        id: lessonData.id,
        course: { connect: { id: lessonData.courseId } },
        title: lessonData.title,
        description: lessonData.description,
        order: lessonData.order,
        status: lessonData.status,
        createdAt: new Date(lessonData.createdAt),
        updatedAt: new Date(lessonData.updatedAt),
        deletedAt: lessonData.deletedAt ? new Date(lessonData.deletedAt) : null,
        content: contentData
          ? {
              create: {
                id: contentData.id || undefined,
                type: contentData.type,
                status: contentData.status,
                title: contentData.title,
                description: contentData.description,
                fileUrl: contentData.fileUrl,
                thumbnailUrl: contentData.thumbnailUrl,
                quizQuestions: contentData.quizQuestions
                  ? {
                      create: contentData.quizQuestions.map(
                        (q: QuizQuestion) => ({
                          id: q.id || undefined,
                          question: q.question,
                          options: q.options,
                          correctAnswer: q.correctAnswer,
                        })
                      ),
                    }
                  : undefined,
                createdAt: new Date(contentData.createdAt),
                updatedAt: new Date(contentData.updatedAt),
                deletedAt: contentData.deletedAt
                  ? new Date(contentData.deletedAt)
                  : null,
              },
            }
          : undefined,
      },
      include: { content: { include: { quizQuestions: true } } },
    });

    return this.mapToLessonEntity(createdLesson);
  }

  async update(lesson: Lesson): Promise<Lesson> {
    const lessonData = lesson.toJSON();
    const contentData = lessonData.content;

    // Check if LessonContent exists before attempting delete
    const existingContent = await this.prisma.lessonContent.findUnique({
      where: { lessonId: lessonData.id },
    });

    const updatedLesson = await this.prisma.lesson.update({
      where: { id: lessonData.id },
      data: {
        title: lessonData.title,
        description: lessonData.description,
        order: lessonData.order,
        status: lessonData.status,
        updatedAt: new Date(lessonData.updatedAt),
        deletedAt: lessonData.deletedAt ? new Date(lessonData.deletedAt) : null,
        content: contentData
          ? {
              upsert: {
                where: { lessonId: lessonData.id },
                create: {
                  id: contentData.id || undefined,
                  type: contentData.type,
                  status: contentData.status,
                  title: contentData.title,
                  description: contentData.description,
                  fileUrl: contentData.fileUrl,
                  thumbnailUrl: contentData.thumbnailUrl,
                  quizQuestions: contentData.quizQuestions
                    ? {
                        create: contentData.quizQuestions.map(
                          (q: QuizQuestion) => ({
                            id: q.id || undefined,
                            question: q.question,
                            options: q.options,
                            correctAnswer: q.correctAnswer,
                          })
                        ),
                      }
                    : undefined,
                  createdAt: new Date(contentData.createdAt),
                  updatedAt: new Date(contentData.updatedAt),
                  deletedAt: contentData.deletedAt
                    ? new Date(contentData.deletedAt)
                    : null,
                },
                update: {
                  type: contentData.type,
                  status: contentData.status,
                  title: contentData.title,
                  description: contentData.description,
                  fileUrl: contentData.fileUrl,
                  thumbnailUrl: contentData.thumbnailUrl,
                  quizQuestions: contentData.quizQuestions
                    ? {
                        deleteMany: {},
                        create: contentData.quizQuestions.map(
                          (q: QuizQuestion) => ({
                            id: q.id || undefined,
                            question: q.question,
                            options: q.options,
                            correctAnswer: q.correctAnswer,
                          })
                        ),
                      }
                    : { deleteMany: {} },
                  updatedAt: new Date(contentData.updatedAt),
                  deletedAt: contentData.deletedAt
                    ? new Date(contentData.deletedAt)
                    : null,
                },
              },
            }
          : existingContent
          ? { delete: { lessonId: lessonData.id } }
          : undefined,
      },
      include: { content: { include: { quizQuestions: true } } },
    });

    return this.mapToLessonEntity(updatedLesson);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lesson.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private mapToLessonEntity(
    lesson: PrismaLesson & {
      content?: (PrismaLessonContent & { quizQuestions: any[] }) | null;
    }
  ): Lesson {
    return Lesson.fromPersistence({
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      status: lesson.status as LessonStatus,
      content: lesson.content
        ? LessonContent.fromPersistence({
            id: lesson.content.id,
            lessonId: lesson.content.lessonId,
            type: lesson.content.type as ContentType,
            status: lesson.content.status as ContentStatus,
            title: lesson.content.title,
            description: lesson.content.description,
            fileUrl: lesson.content.fileUrl,
            thumbnailUrl: lesson.content.thumbnailUrl,
            quizQuestions: lesson.content.quizQuestions
              ? lesson.content.quizQuestions.map((q) => ({
                  id: q.id,
                  question: q.question,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                }))
              : null,
            createdAt: lesson.content.createdAt,
            updatedAt: lesson.content.updatedAt,
            deletedAt: lesson.content.deletedAt,
          })
        : null,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      deletedAt: lesson.deletedAt,
    });
  }

  private mapToLessonOutputDTO(
    lesson: PrismaLesson & {
      content?: (PrismaLessonContent & { quizQuestions: any[] }) | null;
    }
  ): ILessonOutputDTO {
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      status: lesson.status as LessonStatus,
      content: lesson.content
        ? {
            id: lesson.content.id,
            lessonId: lesson.content.lessonId,
            type: lesson.content.type as ContentType,
            status: lesson.content.status as ContentStatus,
            title: lesson.content.title,
            description: lesson.content.description,
            fileUrl: lesson.content.fileUrl,
            thumbnailUrl: lesson.content.thumbnailUrl,
            quizQuestions: lesson.content.quizQuestions
              ? lesson.content.quizQuestions.map((q) => ({
                  id: q.id,
                  question: q.question,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                }))
              : null,
            createdAt: lesson.content.createdAt.toISOString(),
            updatedAt: lesson.content.updatedAt.toISOString(),
            deletedAt: lesson.content.deletedAt?.toISOString() ?? null,
          }
        : null,
      createdAt: lesson.createdAt.toISOString(),
      updatedAt: lesson.updatedAt.toISOString(),
      deletedAt: lesson.deletedAt?.toISOString() ?? null,
    };
  }
}
