import { LessonProgress } from "../../domain/entities/lesson-progress.entity";
import { Course } from "../../domain/entities/course.entity";
import { Lesson } from "../../domain/entities/lesson.entity";
import { User } from "../../domain/entities/user.entity";
import {
  GetCourseProgressRequestDto,
  GetUserProgressRequestDto,
  UpdateLessonProgressRequestDto,
  GetLessonProgressRequestDto,
  MarkLessonCompletedRequestDto,
  QuizAnswerDto,
  CourseProgressResponseDto,
  LessonProgressResponseDto,
  UserProgressResponseDto,
  ProgressSummaryResponseDto,
  QuizProgressResponseDto,
  QuizAnswerResponseDto,
} from "../dtos/progress.dto";

export class ProgressMapper {
  // Domain Entity to Response DTOs
  static toLessonProgressResponseDto(
    lessonProgress: LessonProgress,
    lesson?: Lesson
  ): LessonProgressResponseDto {
    const response: LessonProgressResponseDto = {
      id: lessonProgress.id,
      userId: lessonProgress.userId,
      lessonId: lessonProgress.lessonId,
      isCompleted: lessonProgress.isCompleted,
      completedAt: lessonProgress.completedAt,
      timeSpent: lessonProgress.timeSpent,
      lastAccessedAt: lessonProgress.lastAccessedAt,
      quizScore: lessonProgress.quizScore,
      quizTotalQuestions: lessonProgress.quizTotalQuestions,
      hasQuizScore: lessonProgress.hasQuizScore(),
      quizPercentage: lessonProgress.getQuizPercentage(),
      isQuizPassed: lessonProgress.isQuizPassed(),
      createdAt: lessonProgress.createdAt,
      updatedAt: lessonProgress.updatedAt,
    };

    if (lesson) {
      response.lesson = {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        order: lesson.order,
        status: lesson.status,
      };
    }

    return response;
  }

  static toCourseProgressResponseDto(
    course: Course,
    progressData: {
      totalLessons: number;
      completedLessons: number;
      progressPercentage: number;
      totalTimeSpent: number;
      lastAccessedAt?: Date;
      enrolledAt: Date;
      isCompleted: boolean;
      completedAt?: Date;
    },
    lessonProgress?: LessonProgressResponseDto[]
  ): CourseProgressResponseDto {
    return {
      courseId: course.id,
      courseName: course.title,
      courseDescription: course.description,
      courseThumbnail: course.thumbnail,
      totalLessons: progressData.totalLessons,
      completedLessons: progressData.completedLessons,
      progressPercentage: progressData.progressPercentage,
      totalTimeSpent: progressData.totalTimeSpent,
      lastAccessedAt: progressData.lastAccessedAt,
      enrolledAt: progressData.enrolledAt,
      isCompleted: progressData.isCompleted,
      completedAt: progressData.completedAt,
      lessonProgress: lessonProgress || [],
    };
  }

  static toUserProgressResponseDto(
    user: User,
    progressData: {
      totalCourses: number;
      completedCourses: number;
      inProgressCourses: number;
      totalLessons: number;
      completedLessons: number;
      overallProgressPercentage: number;
      totalTimeSpent: number;
      averageQuizScore: number;
      totalCertificates: number;
    },
    courseProgress?: CourseProgressResponseDto[]
  ): UserProgressResponseDto {
    return {
      userId: user.id,
      userName: user.name,
      userEmail: user.email.address,
      userAvatar: user.avatar,
      totalCourses: progressData.totalCourses,
      completedCourses: progressData.completedCourses,
      inProgressCourses: progressData.inProgressCourses,
      totalLessons: progressData.totalLessons,
      completedLessons: progressData.completedLessons,
      overallProgressPercentage: progressData.overallProgressPercentage,
      totalTimeSpent: progressData.totalTimeSpent,
      averageQuizScore: progressData.averageQuizScore,
      totalCertificates: progressData.totalCertificates,
      courseProgress: courseProgress || [],
    };
  }

  static toProgressSummaryResponseDto(
    summaryData: {
      totalUsers: number;
      activeUsers: number;
      totalCourses: number;
      activeCourses: number;
      totalLessons: number;
      completedLessons: number;
      averageProgressPercentage: number;
      averageTimeSpent: number;
      averageQuizScore: number;
      totalCertificates: number;
    }
  ): ProgressSummaryResponseDto {
    return {
      totalUsers: summaryData.totalUsers,
      activeUsers: summaryData.activeUsers,
      totalCourses: summaryData.totalCourses,
      activeCourses: summaryData.activeCourses,
      totalLessons: summaryData.totalLessons,
      completedLessons: summaryData.completedLessons,
      averageProgressPercentage: summaryData.averageProgressPercentage,
      averageTimeSpent: summaryData.averageTimeSpent,
      averageQuizScore: summaryData.averageQuizScore,
      totalCertificates: summaryData.totalCertificates,
    };
  }

  static toQuizProgressResponseDto(
    lessonProgress: LessonProgress,
    quizData: {
      totalQuestions: number;
      correctAnswers: number;
      incorrectAnswers: number;
      unansweredQuestions: number;
      timeSpent: number;
    }
  ): QuizProgressResponseDto {
    return {
      lessonId: lessonProgress.lessonId,
      userId: lessonProgress.userId,
      totalQuestions: quizData.totalQuestions,
      correctAnswers: quizData.correctAnswers,
      incorrectAnswers: quizData.incorrectAnswers,
      unansweredQuestions: quizData.unansweredQuestions,
      score: lessonProgress.quizScore || 0,
      percentage: lessonProgress.getQuizPercentage(),
      isPassed: lessonProgress.isQuizPassed(),
      timeSpent: quizData.timeSpent,
      completedAt: lessonProgress.completedAt,
    };
  }

  static toQuizAnswerResponseDto(
    answerData: {
      questionId: string;
      selectedAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      explanation?: string;
    }
  ): QuizAnswerResponseDto {
    return {
      questionId: answerData.questionId,
      selectedAnswer: answerData.selectedAnswer,
      correctAnswer: answerData.correctAnswer,
      isCorrect: answerData.isCorrect,
      explanation: answerData.explanation,
    };
  }
}