import { api } from "@/api/api";
import { ApiResponse } from "@/types/apiResponse";
import { InstructorFormData } from "@/types/instructor";
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
