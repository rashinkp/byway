import { UseGetAllCoursesParams } from "@/hooks/course/useGetAllCourse";
import { api } from "./api";
import { CourseApiResponse, Course, AddCourseParams } from "@/types/course";



export async function getAllCourses({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  includeDeleted = false,
}: UseGetAllCoursesParams): Promise<CourseApiResponse> {
  try {
    const response = await api.get<{ data: CourseApiResponse }>("/courses/", {
      params: {
        page,
        limit,
        sortBy,
        sortOrder,
        includeDeleted,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    throw new Error("Failed to fetch courses");
  }
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



export async function deleteCourse(id: string): Promise<void> {
  try {
    await api.delete(`/courses/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Delete category failed");
  }
}


export async function getCourseById(id: string): Promise < Course > {
  try {
    const result = await api.get(`/courses/${id}`);
    return result.data.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.message || "Delete category failed");
  }
}