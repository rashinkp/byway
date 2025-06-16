import { api } from "@/api/api";
import { ApiResponse } from "@/types/apiResponse";
import {  IInstructorWithUserDetails, InstructorFormData, IInstructorDetails } from "@/types/instructor";
import { User } from "@/types/user";

export const createInstructor = async (
  data: InstructorFormData
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>(
      "/instructor/create",
      data,
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error in createInstructor:", error);
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle specific status codes
      if (status === 404) {
        throw {
          response: {
            status: 404,
            data: {
              message: "User not found. Please try logging in again.",
              statusCode: 404,
              success: false,
              data: null
            }
          },
          message: "User not found. Please try logging in again."
        };
      }
      
      if (status === 400) {
        throw {
          response: {
            status: 400,
            data: data || {
              message: "Invalid application data",
              statusCode: 400,
              success: false,
              data: null
            }
          },
          message: data?.message || "Invalid application data"
        };
      }
      
      if (status === 403) {
    throw {
          response: {
            status: 403,
            data: data || {
              message: "You are not authorized to perform this action",
              statusCode: 403,
              success: false,
              data: null
            }
          },
          message: data?.message || "You are not authorized to perform this action"
        };
      }
      
      // For other status codes, preserve the original error structure
      throw {
        response: {
          status: status,
          data: data
        },
        message: data?.message || `Request failed with status ${status}`
      };
    } else if (error.request) {
      // Network error
      throw {
        response: undefined,
        message: "Network error. Please check your connection and try again."
      };
    } else {
      // Other errors
      throw {
        response: undefined,
        message: error.message || "Failed to create instructor"
    };
    }
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

export const getAllInstructors = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filterBy?: "All" | "Pending" | "Approved" | "Declined";
  includeDeleted?: boolean;
}): Promise<ApiResponse<{ items: IInstructorWithUserDetails[]; total: number; totalPages: number }>> => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          // Convert boolean to string for URL params
          if (typeof value === "boolean") {
            queryParams.append(key, value.toString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    const response = await api.get<ApiResponse<{ items: IInstructorWithUserDetails[]; total: number; totalPages: number }>>(
      `/instructor/instructors?${queryParams.toString()}`
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
  ApiResponse<IInstructorWithUserDetails | null>
> => {
  try {
    const response = await api.get<
      ApiResponse<IInstructorWithUserDetails | null>
    >("/instructor/me");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching instructor by user ID:", error);
    
    // Handle 404 errors gracefully - user might not have an instructor record yet
    if (error.response?.status === 404) {
      // Return null instead of throwing error for 404
      return {
        success: true,
        message: "No instructor record found",
        data: null,
        statusCode: 200
      };
    }
    
    // For other errors, throw as usual
    throw new Error(
      error.response?.data?.message || "Failed to fetch instructor"
    );
  }
};

export const getPublicInstructors = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ApiResponse<{ items: IInstructorWithUserDetails[]; total: number; totalPages: number }>> => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await api.get<ApiResponse<{ items: IInstructorWithUserDetails[]; total: number; totalPages: number }>>(
      `/instructor/public/instructors?${queryParams.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching public instructors:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch instructors"
    );
  }
};

export const getInstructorDetails = async (
  userId: string
): Promise<ApiResponse<IInstructorDetails>> => {
  try {
    const response = await api.get<ApiResponse<IInstructorDetails>>(
      `/instructor/${userId}`
    );
    return response.data;
  } catch (error: any) {
    throw {
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : undefined,
      message: error.response?.data?.message || "Failed to get instructor details",
    };
  }
};