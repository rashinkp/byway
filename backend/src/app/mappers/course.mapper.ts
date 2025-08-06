import { CourseRecord } from "../records/course.record";
import { CourseDetailsRecord } from "../records/course-details.record";
import {
  CreateCourseRequestDto,
  UpdateCourseRequestDto,
  CourseResponseDto,
  CourseWithEnrollmentResponseDto,
  CourseWithDetailsResponseDto,
  CourseListResponseDto,
} from "../dtos/course.dto";

export class CourseMapper {
  // Record to Response DTOs
  static toCourseResponseDto(courseRecord: CourseRecord, additionalData?: {
    rating?: number;
    reviewCount?: number;
    formattedDuration?: string;
    lessons?: number;
    bestSeller?: boolean;
    progress?: number;
    completedLessons?: number;
    totalLessons?: number;
    lastAccessed?: string;
    isEnrolled?: boolean;
    reviewStats?: any;
  }): CourseResponseDto {
    return {
      id: courseRecord.id,
      title: courseRecord.title,
      description: courseRecord.description,
      level: courseRecord.level,
      price: courseRecord.price,
      thumbnail: courseRecord.thumbnail,
      duration: courseRecord.duration,
      offer: courseRecord.offer,
      status: courseRecord.status,
      categoryId: courseRecord.categoryId,
      createdBy: courseRecord.createdBy,
      createdAt: courseRecord.createdAt,
      updatedAt: courseRecord.updatedAt,
      deletedAt: courseRecord.deletedAt,
      approvalStatus: courseRecord.approvalStatus,
      adminSharePercentage: courseRecord.adminSharePercentage,
      instructorSharePercentage: 100 - courseRecord.adminSharePercentage,
      ...additionalData,
    };
  }

  static toCourseWithEnrollmentResponseDto(
    courseRecord: CourseRecord,
    additionalData: {
      isEnrolled: boolean;
      isInCart: boolean;
      instructor: any;
      reviewStats: any;
      rating?: number;
      reviewCount?: number;
      formattedDuration?: string;
      lessons?: number;
      bestSeller?: boolean;
    }
  ): CourseWithEnrollmentResponseDto {
    return {
      id: courseRecord.id,
      title: courseRecord.title,
      description: courseRecord.description,
      level: courseRecord.level,
      price: courseRecord.price,
      thumbnail: courseRecord.thumbnail,
      duration: courseRecord.duration,
      offer: courseRecord.offer,
      status: courseRecord.status,
      categoryId: courseRecord.categoryId,
      createdBy: courseRecord.createdBy,
      createdAt: courseRecord.createdAt.toISOString(),
      updatedAt: courseRecord.updatedAt.toISOString(),
      deletedAt: courseRecord.deletedAt?.toISOString(),
      approvalStatus: courseRecord.approvalStatus,
      adminSharePercentage: courseRecord.adminSharePercentage,
      instructorSharePercentage: 100 - courseRecord.adminSharePercentage,
      isEnrolled: additionalData.isEnrolled,
      isInCart: additionalData.isInCart,
      instructor: additionalData.instructor,
      reviewStats: additionalData.reviewStats,
      rating: additionalData.rating,
      reviewCount: additionalData.reviewCount,
      formattedDuration: additionalData.formattedDuration,
      lessons: additionalData.lessons,
      bestSeller: additionalData.bestSeller,
    };
  }

  static toCourseWithDetailsResponseDto(
    courseRecord: CourseRecord,
    courseDetailsRecord: CourseDetailsRecord | null,
    additionalData?: {
      rating?: number;
      reviewCount?: number;
      formattedDuration?: string;
      lessons?: number;
      bestSeller?: boolean;
      progress?: number;
      completedLessons?: number;
      totalLessons?: number;
      lastAccessed?: string;
      isEnrolled?: boolean;
      reviewStats?: any;
    }
  ): CourseWithDetailsResponseDto {
    return {
      id: courseRecord.id,
      title: courseRecord.title,
      description: courseRecord.description,
      level: courseRecord.level,
      price: courseRecord.price,
      thumbnail: courseRecord.thumbnail,
      duration: courseRecord.duration,
      offer: courseRecord.offer,
      status: courseRecord.status,
      categoryId: courseRecord.categoryId,
      createdBy: courseRecord.createdBy,
      createdAt: courseRecord.createdAt.toISOString(),
      updatedAt: courseRecord.updatedAt.toISOString(),
      deletedAt: courseRecord.deletedAt?.toISOString(),
      approvalStatus: courseRecord.approvalStatus,
      adminSharePercentage: courseRecord.adminSharePercentage,
      instructorSharePercentage: 100 - courseRecord.adminSharePercentage,
      prerequisites: courseDetailsRecord?.prerequisites,
      longDescription: courseDetailsRecord?.longDescription,
      objectives: courseDetailsRecord?.objectives,
      targetAudience: courseDetailsRecord?.targetAudience,
      ...additionalData,
    };
  }

  static toCourseListResponseDto(
    courseRecords: CourseRecord[],
    total: number,
    totalPages: number,
    additionalData: {
      isEnrolled: boolean;
      isInCart: boolean;
      instructor: any;
      reviewStats: any;
      rating?: number;
      reviewCount?: number;
      formattedDuration?: string;
      lessons?: number;
      bestSeller?: boolean;
    }[]
  ): CourseListResponseDto {
    const courses = courseRecords.map((courseRecord, index) =>
      this.toCourseWithEnrollmentResponseDto(courseRecord, additionalData[index])
    );

    return {
      courses,
      total,
      totalPage: totalPages,
    };
  }

  // Request DTOs to Record
  static fromCreateCourseRequestDto(dto: CreateCourseRequestDto): CourseRecord {
    return {
      id: "", // Will be generated by database
      title: dto.title,
      description: dto.description,
      level: dto.level,
      price: dto.price,
      thumbnail: dto.thumbnail,
      duration: dto.duration,
      offer: dto.offer,
      status: dto.status,
      categoryId: dto.categoryId,
      createdBy: dto.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      approvalStatus: "PENDING",
      adminSharePercentage: dto.adminSharePercentage || 10,
    };
  }

  static fromUpdateCourseRequestDto(dto: UpdateCourseRequestDto, existingRecord: CourseRecord): CourseRecord {
    return {
      ...existingRecord,
      title: dto.title ?? existingRecord.title,
      description: dto.description ?? existingRecord.description,
      level: dto.level ?? existingRecord.level,
      price: dto.price ?? existingRecord.price,
      thumbnail: dto.thumbnail ?? existingRecord.thumbnail,
      duration: dto.duration ?? existingRecord.duration,
      offer: dto.offer ?? existingRecord.offer,
      status: dto.status ?? existingRecord.status,
      categoryId: dto.categoryId ?? existingRecord.categoryId,
      adminSharePercentage: dto.adminSharePercentage ?? existingRecord.adminSharePercentage,
      updatedAt: new Date(),
    };
  }

  static fromCreateCourseRequestDtoToDetails(dto: CreateCourseRequestDto): CourseDetailsRecord {
    return {
      id: "", // Will be generated by database
      courseId: "", // Will be set after course creation
      prerequisites: dto.prerequisites,
      longDescription: dto.longDescription,
      objectives: dto.objectives,
      targetAudience: dto.targetAudience,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static fromUpdateCourseRequestDtoToDetails(dto: UpdateCourseRequestDto, existingDetails: CourseDetailsRecord | null): CourseDetailsRecord {
    if (!existingDetails) {
      return {
        id: "",
        courseId: dto.id,
        prerequisites: dto.prerequisites,
        longDescription: dto.longDescription,
        objectives: dto.objectives,
        targetAudience: dto.targetAudience,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return {
      ...existingDetails,
      prerequisites: dto.prerequisites ?? existingDetails.prerequisites,
      longDescription: dto.longDescription ?? existingDetails.longDescription,
      objectives: dto.objectives ?? existingDetails.objectives,
      targetAudience: dto.targetAudience ?? existingDetails.targetAudience,
      updatedAt: new Date(),
    };
  }
} 