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
    console.log("Creating content with data:", data);
    const response = await api.post<{ data: LessonContent }>("/content", data);
    console.log("Content creation response:", response.data);
    return response.data.data;
  } catch (error: any) {
    
    if (error.response?.status === 401) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    if (error.response?.status === 403) {
      throw new Error("You don't have permission to create content.");
    }
    
    if (error.response?.status === 404) {
      throw new Error("Content endpoint not found. Please check the API configuration.");
    }
    
    // Check if the response is HTML instead of JSON
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.trim().startsWith('<!DOCTYPE html>')) {
      console.error("Received HTML response instead of JSON:", error.response.data);
      throw new Error("Server returned an HTML error page. Please check the API configuration.");
    }
    
    throw new Error(
      error.response?.data?.message || "Failed to create content. Please try again."
    );
  }
}

export async function updateContent(
  data: UpdateLessonContentInput
): Promise<LessonContent> {
  try {
    console.log("Updating content with data:", data);
    const response = await api.patch<{ data: LessonContent }>(
      `/content/${data.id}`,
      data
    );
    console.log("Content update response:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Content update error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    if (error.response?.status === 403) {
      throw new Error("You don't have permission to update content.");
    }
    
    if (error.response?.status === 404) {
      throw new Error("Content not found.");
    }
    
    throw new Error(
      error.response?.data?.message || "Failed to update content. Please try again."
    );
  }
}

export async function getContentByLessonId(
  lessonId: string
): Promise<LessonContent | null> {
  try {
    console.log("Fetching content for lesson:", lessonId);
    const response = await api.get<{ data: LessonContent | null }>(
      `/content/${lessonId}`
    );
    console.log("Content fetch response:", response.data);
    return response.data.data;
  } catch (error: any) {
    
    if (error.response?.status === 401) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    if (error.response?.status === 403) {
      throw new Error("You don't have permission to view this content.");
    }
    
    if (error.response?.status === 404) {
      return null; // Return null for 404 instead of throwing
    }
    
    throw new Error(
      error.response?.data?.message || "Failed to fetch content. Please try again."
    );
  }
}

export async function deleteContent(contentId: string): Promise<void> {
  try {
    console.log("Deleting content:", contentId);
    await api.delete(`/content/${contentId}`);
    console.log("Content deleted successfully");
  } catch (error: any) {
    console.error("Content deletion error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    if (error.response?.status === 403) {
      throw new Error("You don't have permission to delete this content.");
    }
    
    if (error.response?.status === 404) {
      throw new Error("Content not found.");
    }
    
    throw new Error(
      error.response?.data?.message || "Failed to delete content. Please try again."
    );
  }
}
