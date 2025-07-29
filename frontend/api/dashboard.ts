
import { InstructorDashboardResponse } from "@/types/instructor";
import { api } from "./api";
import { DashboardResponse } from "@/types/dashboard";
import { ApiResponse } from "@/types/general";

export async function getAdminDashboard(): Promise<DashboardResponse> {
	try {
		const response =
			await api.get<ApiResponse<DashboardResponse>>("/dashboard/admin");
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || "Error while getting dashboard data",
		);
	}
}

export async function getInstructorDashboard(): Promise<InstructorDashboardResponse> {
	try {
		const response = await api.get<ApiResponse<InstructorDashboardResponse>>(
			"/dashboard/instructor",
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				"Error while getting instructor dashboard data",
		);
	}
}
