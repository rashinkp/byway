import { PrismaClient } from "@prisma/client";
import { LessonProgress } from "../../domain/entities/progress.entity";
import { ILessonProgressRepository } from "../../app/repositories/lesson-progress.repository.interface";
import { HttpError } from "../../presentation/http/errors/http-error";
import { QuizAnswer } from "../../domain/entities/quiz-answer.entity";

export class LessonProgressRepository implements ILessonProgressRepository {
  constructor(private readonly _prisma: PrismaClient) {}

  async save(progress: LessonProgress): Promise<LessonProgress> {
    const data = progress.toJSON();
    const created = await this._prisma.lessonProgress.create({
      data: {
        enrollmentId: data.enrollmentId,
        courseId: data.courseId,
        lessonId: data.lessonId,
        completed: data.completed,
        completedAt: data.completedAt,
        score: data.score ?? undefined,
        totalQuestions: data.totalQuestions ?? undefined,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      include: {
        answers: {
          include: {
            quizQuestion: true,
          },
        },
      },
    });

    return LessonProgress.fromPersistence({
      id: created.id,
      enrollmentId: created.enrollmentId,
      courseId: created.courseId,
      lessonId: created.lessonId,
      completed: created.completed,
      completedAt: created.completedAt,
      score: created.score ?? undefined,
      totalQuestions: created.totalQuestions ?? undefined,
      answers: created.answers.map((answer) =>
        QuizAnswer.fromPersistence({
          id: answer.id,
          lessonProgressId: answer.lessonProgressId,
          quizQuestionId: answer.quizQuestionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        })
      ),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async findByEnrollmentAndLesson(
    enrollmentId: string,
    courseId: string,
    lessonId: string
  ): Promise<LessonProgress | null> {
    const progress = await this._prisma.lessonProgress.findUnique({
      where: {
        enrollmentId_courseId_lessonId: {
          enrollmentId,
          courseId,
          lessonId,
        },
      },
      include: {
        answers: {
          include: {
            quizQuestion: true,
          },
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
      score: progress.score ?? undefined,
      totalQuestions: progress.totalQuestions ?? undefined,
      answers: progress.answers.map((answer) =>
        QuizAnswer.fromPersistence({
          id: answer.id,
          lessonProgressId: answer.lessonProgressId,
          quizQuestionId: answer.quizQuestionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        })
      ),
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    });
  }

  async findByEnrollment(
    enrollmentId: string,
    courseId: string
  ): Promise<LessonProgress[]> {
    const progress = await this._prisma.lessonProgress.findMany({
      where: {
        enrollmentId,
        courseId,
      },
      include: {
        answers: {
          include: {
            quizQuestion: true,
          },
        },
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
        score: p.score ?? undefined,
        totalQuestions: p.totalQuestions ?? undefined,
        answers: p.answers.map((answer) =>
          QuizAnswer.fromPersistence({
            id: answer.id,
            lessonProgressId: answer.lessonProgressId,
            quizQuestionId: answer.quizQuestionId,
            selectedAnswer: answer.selectedAnswer,
            isCorrect: answer.isCorrect,
            createdAt: answer.createdAt,
            updatedAt: answer.updatedAt,
          })
        ),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })
    );
  }

  async update(progress: LessonProgress): Promise<LessonProgress> {
    const data = progress.toJSON();
    const updated = await this._prisma.lessonProgress.update({
      where: {
        id: data.id,
      },
      data: {
        completed: data.completed,
        completedAt: data.completedAt,
        score: data.score ?? undefined,
        totalQuestions: data.totalQuestions ?? undefined,
        updatedAt: data.updatedAt,
      },
      include: {
        answers: {
          include: {
            quizQuestion: true,
          },
        },
      },
    });

    return LessonProgress.fromPersistence({
      id: updated.id,
      enrollmentId: updated.enrollmentId,
      courseId: updated.courseId,
      lessonId: updated.lessonId,
      completed: updated.completed,
      completedAt: updated.completedAt,
      score: updated.score ?? undefined,
      totalQuestions: updated.totalQuestions ?? undefined,
      answers: updated.answers.map((answer) =>
        QuizAnswer.fromPersistence({
          id: answer.id,
          lessonProgressId: answer.lessonProgressId,
          quizQuestionId: answer.quizQuestionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        })
      ),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async calculateCourseProgress(
    enrollmentId: string,
    courseId: string
  ): Promise<number> {
    try {
      const [totalLessons, completedLessons] = await Promise.all([
        this._prisma.lesson.count({
          where: {
            courseId,
            deletedAt: null,
          },
        }),
        this._prisma.lessonProgress.count({
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

  async saveQuizAnswers(
    progressId: string,
    answers: QuizAnswer[]
  ): Promise<void> {
    await this._prisma.$transaction(async (prisma) => {
      // Delete existing answers
      await prisma.quizAnswer.deleteMany({
        where: { lessonProgressId: progressId },
      });

      // Create new answers
      await prisma.quizAnswer.createMany({
        data: answers.map((answer) => ({
          id: answer.id,
          lessonProgressId: progressId,
          quizQuestionId: answer.quizQuestionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        })),
      });
    });
  }

  async findQuizAnswers(progressId: string): Promise<QuizAnswer[]> {
    const answers = await this._prisma.quizAnswer.findMany({
      where: { lessonProgressId: progressId },
      include: { quizQuestion: true },
    });

    return answers.map((answer) =>
      QuizAnswer.fromPersistence({
        id: answer.id,
        lessonProgressId: answer.lessonProgressId,
        quizQuestionId: answer.quizQuestionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.isCorrect,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
      })
    );
  }
}
