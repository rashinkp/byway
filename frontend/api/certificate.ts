import { CertificateDTO } from "@/types/certificate";
import { api } from "@/api/api";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";

export async function getCertificate(
	courseId: string,
): Promise<CertificateDTO | null> {
	try {
		const response = await api.get<ApiResponse<CertificateDTO>>(
			`/certificates?courseId=${courseId}`,
		);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		if (apiError.response?.status === 404) return null;
		throw apiError;
	}
}

export async function generateCertificate(
	courseId: string,
): Promise<CertificateDTO> {
	const response = await api.post<ApiResponse<CertificateDTO>>(
		"/certificates/generate",
		{ courseId },
	);
	return response.data.data;
}

export async function listUserCertificates(params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	status?: string;
	search?: string;
}): Promise<{
	items: CertificateDTO[];
	total: number;
	page: number;
	totalPages: number;
	hasMore: boolean;
	nextPage?: number;
}> {
	const query = new URLSearchParams();
	if (params) {
		if (params.page) query.append("page", params.page.toString());
		if (params.limit) query.append("limit", params.limit.toString());
		if (params.sortBy) query.append("sortBy", params.sortBy);
		if (params.sortOrder) query.append("sortOrder", params.sortOrder);
		if (params.status) query.append("status", params.status);
		if (params.search) query.append("search", params.search);
	}
	const response = await api.get<ApiResponse<{
		items: CertificateDTO[];
		total: number;
		page: number;
		totalPages: number;
		hasMore: boolean;
		nextPage?: number;
	}>>(
		`/certificates/list${query.toString() ? `?${query.toString()}` : ""}`,
	);
	return response.data.data;
}
