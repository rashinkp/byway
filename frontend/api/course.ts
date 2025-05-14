import { api } from "./api";
import {
  CourseApiResponse,
  Course,
  AddCourseParams,
  CourseEditFormData,
  IGetAllCoursesInput,
  IGetEnrolledCoursesInput,
  IUpdateCourseApprovalInput,
} from "@/types/course";

export async function getAllCourses({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  includeDeleted = false,
  filterBy = "All",
  search = "",
  myCourses = false,
  role = "USER",
  level = "All",
  duration = "All",
  price = "All",
}: IGetAllCoursesInput): Promise<CourseApiResponse> {
  try {
    const response = await api.get<{ data: CourseApiResponse }>("/courses/", {
      params: {
        page,
        limit,
        sortBy,
        sortOrder,
        includeDeleted,
        search,
        filterBy,
        myCourses,
        role,
        level,
        duration,
        price,
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch courses:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch courses");
  }
}

export async function createCourse(
  courseData: AddCourseParams
): Promise<Course> {
  try {
    const response = await api.post<{ data: Course }>("/courses/", courseData);
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to create course:", error);
    throw new Error(error.response?.data?.message || "Failed to create course");
  }
}

export async function deleteCourse(id: string): Promise<void> {
  try {
    await api.delete(`/courses/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete course");
  }
}

export async function getCourseById(id: string): Promise<Course> {
  try {
    const result = await api.get(`/courses/${id}`);
    return result.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch course");
  }
}

export async function updateCourse(
  id: string,
  courseData: CourseEditFormData
): Promise<Course> {
  try {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to update course";
    throw new Error(errorMessage);
  }
}

export async function getEnrolledCourses({
  page = 1,
  limit = 10,
  sortBy = "enrolledAt",
  sortOrder = "desc",
  search = "",
  level = "All",
}: IGetEnrolledCoursesInput): Promise<CourseApiResponse> {
  try {
    const response = await api.get<{ data: CourseApiResponse }>(
      "/courses/enrolled",
      {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
          search,
          level,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch enrolled courses:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch enrolled courses"
    );
  }
}

export async function approveCourse({
  courseId,
}: IUpdateCourseApprovalInput): Promise<Course> {
  try {
    const response = await api.post<{ data: Course }>("/courses/approve", {
      courseId,
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to approve course:", error);
    throw new Error(
      error.response?.data?.message || "Failed to approve course"
    );
  }
}

export async function declineCourse({
  courseId,
}: IUpdateCourseApprovalInput): Promise<Course> {
  try {
    const response = await api.post<{ data: Course }>("/courses/decline", {
      courseId,
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to decline course:", error);
    throw new Error(
      error.response?.data?.message || "Failed to decline course"
    );
  }
}
