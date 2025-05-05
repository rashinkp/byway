
import { api } from "./api";
import { CourseApiResponse, Course, AddCourseParams, CourseEditFormData, IGetAllCoursesInput } from "@/types/course";



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



export async function updateCourse(
  id: string,
  courseData: CourseEditFormData,
): Promise<Course> {
  try {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data.data;
  } catch (error:any) {
     const errorMessage =
       error.response?.data?.message || "Failed to update course";
     throw new Error(`${errorMessage}`);
  }
}