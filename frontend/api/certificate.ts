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