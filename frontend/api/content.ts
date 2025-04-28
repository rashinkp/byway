import { api } from "./api";
import {
  LessonContent,
  CreateLessonContentInput,
  UpdateLessonContentInput,
} from "@/types/content";

export async function createContent(
  data: CreateLessonContentInput
): Promise<LessonContent> {
  try {
    const response = await api.post<{ data: LessonContent }>("/content", data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create content"
    );
  }
}

export async function updateContent(
  data: UpdateLessonContentInput
): Promise<LessonContent> {
  try {
    const response = await api.patch<{ data: LessonContent }>(
      `/content/${data.id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update content"
    );
  }
}

export async function getContentByLessonId(
  lessonId: string
): Promise<LessonContent | null> {
  try {
    const response = await api.get<{ data: LessonContent | null }>(
      `/content/${lessonId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch content");
  }
}

export async function deleteContent(contentId: string): Promise<void> {
  try {
    await api.delete(`/content/${contentId}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete content"
    );
  }
}
