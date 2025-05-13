import { api } from "@/api/api";
import { ApiResponse } from "@/types/apiResponse";
import { IInstructorDetails, IInstructorWithUserDetails, InstructorFormData } from "@/types/instructor";
import { User } from "@/types/user";

export const createInstructor = async (
  data: InstructorFormData
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>(
      "/instructor/create",
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating instructor:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create instructor"
    );
  }
};

export const approveInstructor = async (
  instructorId: string
): Promise<ApiResponse<{ id: string; status: string }>> => {
  try {
    const response = await api.post<
      ApiResponse<{ id: string; status: string }>
    >("/instructor/approve", { instructorId });
    return response.data;
  } catch (error: any) {
    console.error("Error approving instructor:", error);
    throw new Error(
      error.response?.data?.message || "Failed to approve instructor"
    );
  }
};

export const declineInstructor = async (
  instructorId: string
): Promise<ApiResponse<{ id: string; status: string }>> => {
  try {
    const response = await api.post<
      ApiResponse<{ id: string; status: string }>
    >("/instructor/decline", { instructorId });
    return response.data;
  } catch (error: any) {
    console.error("Error declining instructor:", error);
    throw new Error(
      error.response?.data?.message || "Failed to decline instructor"
    );
  }
};

export const getAllInstructors = async (): Promise<
  ApiResponse<IInstructorWithUserDetails[]>
> => {
  try {
    const response = await api.get<ApiResponse<IInstructorWithUserDetails[]>>(
      "/instructor/all"
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching instructors:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch instructors"
    );
  }
};



export const getInstructorByUserId = async (): Promise<
  ApiResponse<IInstructorDetails | null>
> => {
  try {
    const response = await api.get<ApiResponse<IInstructorDetails | null>>(
      "/instructor/me"
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching instructor by user ID:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch instructor"
    );
  }
};