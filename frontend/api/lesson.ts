import { GetAllLessonsParams, GetAllLessonsResponse, ILesson } from "@/types/lesson";
import { api } from "./api";

export async function getAllLessonsInCourse({
  courseId,
  page = 1,
  limit = 10,
  sortBy = "order",
  sortOrder = "asc",
  search = "",
  filterBy = "ALL",
  includeDeleted = false,
}: GetAllLessonsParams): Promise<GetAllLessonsResponse> {
  try {
    const response = await api.get<{ data: GetAllLessonsResponse }>(
      `/lessons/${courseId}/lessons`,
      {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
          search,
          filterBy,
          includeDeleted,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch lessons");
  }
}


export async function createLesson(data: {
  courseId: string;
  title: string;
  description?: string;
  order: number;
  thumbnail?: string;
  duration?: number;
}): Promise<ILesson> {
  try {
    const response = await api.post<{ data: ILesson }>("/lessons", data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create lesson");
  }
}

// Update a lesson
export async function updateLesson(
  lessonId: string,
  data: {
    title?: string;
    description?: string;
    order?: number;
    thumbnail?: string;
    duration?: number;
  }
): Promise<ILesson> {
  try {
    const response = await api.patch<{ data: ILesson }>(
      `/lessons/${lessonId}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update lesson");
  }
}

// Delete a lesson (soft delete)
export async function deleteLesson(lessonId: string): Promise<void> {
  try {
    await api.delete(`/lessons/${lessonId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete lesson");
  }
}