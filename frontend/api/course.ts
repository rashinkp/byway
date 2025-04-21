import { api } from "./api";
import { CourseApiResponse, Course } from "@/types/course";

interface GetAllCoursesParams {
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  createdBy: string; 
}

export async function getAllCourses({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  includeDeleted = false,
  createdBy,
}: GetAllCoursesParams): Promise<CourseApiResponse> {
  try {
    const response = await api.get<{ data: CourseApiResponse }>("/courses/", {
      params: {
        page,
        limit,
        sortBy,
        sortOrder,
        includeDeleted,
        createdBy,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    throw new Error("Failed to fetch courses");
  }
}

interface AddCourseParams {
  title: string;
  description?: string | null;
  categoryId: string;
  price?: number | null;
  duration?: number | null;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED";
  thumbnail?: string | null;
  offer?: number | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  details?: {
    prerequisites?: string | null;
    longDescription?: string | null;
    objectives?: string | null;
    targetAudience?: string | null;
  } | null;
}

export async function createCourse(
  courseData: AddCourseParams
): Promise<Course> {
  try {
    const response = await api.post<{ data: Course }>("/courses/", courseData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create course:", error);
    throw new Error("Failed to create course");
  }
}
