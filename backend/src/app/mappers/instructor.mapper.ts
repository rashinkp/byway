import { Instructor } from "../../domain/entities/instructor.entity";
import { User } from "../../domain/entities/user.entity";
import {
  CreateInstructorRequestDto,
  UpdateInstructorRequestDto,
  GetAllInstructorsRequestDto,
  GetInstructorByIdRequestDto,
  UpdateInstructorStatusRequestDto,
  GetInstructorStatsRequestDto,
  InstructorResponseDto,
  InstructorListResponseDto,
  InstructorStatsResponseDto,
} from "../dtos/instructor.dto";

export class InstructorMapper {
  // Domain Entity to Response DTOs
  static toInstructorResponseDto(
    instructor: Instructor,
    user?: User,
    additionalData?: {
      totalCourses?: number;
      totalStudents?: number;
      totalRevenue?: number;
      averageRating?: number;
      totalReviews?: number;
    }
  ): InstructorResponseDto {
    const response: InstructorResponseDto = {
      id: instructor.id,
      userId: instructor.userId,
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
      createdAt: instructor.createdAt,
      updatedAt: instructor.updatedAt,
      deletedAt: instructor.deletedAt,
    };

    if (user) {
      response.user = {
        id: user.id,
        name: user.name,
        email: user.email.address,
        avatar: user.avatar,
        role: user.role,
        isActive: !user.isDeleted(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }

    if (additionalData) {
      Object.assign(response, additionalData);
    }

    return response;
  }

  static toInstructorListResponseDto(
    instructors: InstructorResponseDto[],
    pagination: {
      total: number;
      totalPages: number;
    }
  ): InstructorListResponseDto {
    return {
      instructors,
      total: pagination.total,
      totalPages: pagination.totalPages,
    };
  }

  static toInstructorStatsResponseDto(
    totalInstructors: number,
    activeInstructors: number,
    pendingInstructors: number,
    approvedInstructors: number,
    declinedInstructors: number,
    topInstructors: Array<{
      id: string;
      name: string;
      totalCourses: number;
      totalStudents: number;
      totalRevenue: number;
      averageRating: number;
    }>
  ): InstructorStatsResponseDto {
    return {
      totalInstructors,
      activeInstructors,
      pendingInstructors,
      approvedInstructors,
      declinedInstructors,
      topInstructors,
    };
  }
}