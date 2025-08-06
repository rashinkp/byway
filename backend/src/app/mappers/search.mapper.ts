import { Course } from "../../domain/entities/course.entity";
import { Instructor } from "../../domain/entities/instructor.entity";
import { Lesson } from "../../domain/entities/lesson.entity";
import { User } from "../../domain/entities/user.entity";
import {
  SearchCoursesRequestDto,
  SearchInstructorsRequestDto,
  SearchLessonsRequestDto,
  GlobalSearchRequestDto,
  SearchResultDto,
  CourseSearchResultDto,
  InstructorSearchResultDto,
  LessonSearchResultDto,
  SearchResponseDto,
  CourseSearchResponseDto,
  InstructorSearchResponseDto,
  LessonSearchResponseDto,
  GlobalSearchResponseDto,
} from "../dtos/search.dto";

export class SearchMapper {
  // Domain Entity to Response DTOs
  static toCourseSearchResultDto(
    course: Course,
    additionalData?: {
      rating?: number;
      reviewCount?: number;
      instructorName?: string;
      categoryName?: string;
      enrollmentCount?: number;
    }
  ): CourseSearchResultDto {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      price: course.price,
      thumbnail: course.thumbnail,
      duration: course.duration,
      offer: course.offer,
      status: course.status,
      categoryId: course.categoryId,
      createdBy: course.createdBy,
      approvalStatus: course.approvalStatus,
      finalPrice: course.getFinalPrice(),
      isFree: course.isFree(),
      isPublished: course.isPublished(),
      canBeEnrolled: course.canBeEnrolled(),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      ...additionalData,
    };
  }

  static toInstructorSearchResultDto(
    instructor: Instructor,
    user: User,
    additionalData?: {
      totalCourses?: number;
      totalStudents?: number;
      averageRating?: number;
      totalReviews?: number;
    }
  ): InstructorSearchResultDto {
    return {
      id: instructor.id,
      userId: instructor.userId,
      name: user.name,
      email: user.email.address,
      avatar: user.avatar,
      bio: instructor.bio,
      expertise: instructor.expertise,
      experience: instructor.experience,
      qualification: instructor.qualification,
      profilePicture: instructor.profilePicture,
      socialLinks: instructor.socialLinks,
      studentCount: instructor.studentCount,
      status: instructor.status,
      isActive: instructor.isActive(),
      isApproved: instructor.isApproved(),
      canCreateCourses: instructor.canCreateCourses(),
      hasCompleteProfile: instructor.hasCompleteProfile(),
      createdAt: instructor.createdAt,
      updatedAt: instructor.updatedAt,
      ...additionalData,
    };
  }

  static toLessonSearchResultDto(
    lesson: Lesson,
    additionalData?: {
      courseName?: string;
      instructorName?: string;
      categoryName?: string;
    }
  ): LessonSearchResultDto {
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      order: lesson.order,
      status: lesson.status,
      isActive: lesson.isActive(),
      isPublished: lesson.isPublished(),
      hasContent: lesson.hasContent(),
      canBeAccessed: lesson.canBeAccessed(),
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      ...additionalData,
    };
  }

  static toSearchResultDto(
    type: 'course' | 'instructor' | 'lesson',
    result: CourseSearchResultDto | InstructorSearchResultDto | LessonSearchResultDto
  ): SearchResultDto {
    return {
      type,
      result,
    };
  }

  static toCourseSearchResponseDto(
    courses: CourseSearchResultDto[],
    pagination: {
      total: number;
      totalPages: number;
    },
    filters?: {
      categories?: string[];
      levels?: string[];
      priceRanges?: string[];
      ratings?: number[];
    }
  ): CourseSearchResponseDto {
    return {
      courses,
      total: pagination.total,
      totalPages: pagination.totalPages,
      filters,
    };
  }

  static toInstructorSearchResponseDto(
    instructors: InstructorSearchResultDto[],
    pagination: {
      total: number;
      totalPages: number;
    }
  ): InstructorSearchResponseDto {
    return {
      instructors,
      total: pagination.total,
      totalPages: pagination.totalPages,
    };
  }

  static toLessonSearchResponseDto(
    lessons: LessonSearchResultDto[],
    pagination: {
      total: number;
      totalPages: number;
    }
  ): LessonSearchResponseDto {
    return {
      lessons,
      total: pagination.total,
      totalPages: pagination.totalPages,
    };
  }

  static toGlobalSearchResponseDto(
    results: SearchResultDto[],
    summary: {
      totalResults: number;
      courseCount: number;
      instructorCount: number;
      lessonCount: number;
    }
  ): GlobalSearchResponseDto {
    return {
      results,
      totalResults: summary.totalResults,
      courseCount: summary.courseCount,
      instructorCount: summary.instructorCount,
      lessonCount: summary.lessonCount,
    };
  }
}