
import { InstructorDashboardResponse } from "@/types/instructor";
import { api } from "./api";
import { DashboardResponse } from "@/types/dashboard";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";

export async function getAdminDashboard(): Promise<DashboardResponse> {
	try {
		const response =
			await api.get<ApiResponse<DashboardResponse>>("/dashboard/admin");
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Error while getting dashboard data",
		);
	}
}

export async function getInstructorDashboard(): Promise<InstructorDashboardResponse> {
	try {
		const response = await api.get<ApiResponse<InstructorDashboardResponse>>(
			"/dashboard/instructor",
		);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message ||
				"Error while getting instructor dashboard data",
		);
	}
}
