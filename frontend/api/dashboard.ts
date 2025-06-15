import { api } from "./api";
import { DashboardResponse, ApiResponse } from "@/types/dashboard";

export async function getAdminDashboard(): Promise<DashboardResponse> {
  try {
    const response = await api.get<ApiResponse<DashboardResponse>>("/dashboard/admin");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error while getting dashboard data');
  }
}