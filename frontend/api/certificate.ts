import { CertificateDTO } from "@/types/certificate";
import { api } from "./api";
import { ApiResponse } from "@/types/apiResponse";

export async function getCertificate(courseId: string): Promise<CertificateDTO | null> {
  try {
    const response = await api.get<ApiResponse<CertificateDTO>>(
      `/certificates?courseId=${courseId}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

export async function generateCertificate(courseId: string): Promise<CertificateDTO> {
  const response = await api.post<ApiResponse<CertificateDTO>>(
    "/certificates/generate",
    { courseId }
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
  const response = await api.get<ApiResponse<any>>(`/certificates/list${query.toString() ? `?${query.toString()}` : ""}`);
  return response.data.data;
} 