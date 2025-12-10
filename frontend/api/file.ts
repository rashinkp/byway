import { GeneratePresignedUrlParams, PresignedPutResponse, PresignedGetResponse } from "@/types/file";
import { api } from "./api";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";
import axios from "axios";

export async function getPresignedPutUrl(
	params: GeneratePresignedUrlParams
): Promise<PresignedPutResponse> {
	try {
		const response = await api.post<ApiResponse<PresignedPutResponse>>(
			"/files/generate-presigned-url",
			params,
		);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message ||
				apiError.response?.data?.error ||
				"Failed to get presigned URL",
		);
	}
}

// Convenience functions for different upload types
export async function getCoursePresignedUrl(
	fileName: string,
	fileType: string,
	courseId: string,
	contentType: 'thumbnail' | 'video' | 'document' = 'video'
): Promise<PresignedPutResponse> {
	return getPresignedPutUrl({
		fileName,
		fileType,
		uploadType: 'course',
		metadata: {
			courseId,
			contentType,
		},
	});
}

export async function getProfilePresignedUrl(
	fileName: string,
	fileType: string,
	userId: string,
	contentType: 'avatar' | 'cv' = 'avatar'
): Promise<PresignedPutResponse> {
	return getPresignedPutUrl({
		fileName,
		fileType,
		uploadType: 'profile',
		metadata: {
			userId,
			contentType,
		},
	});
}

export async function getCertificatePresignedUrl(
	fileName: string,
	fileType: string,
	courseId: string,
	certificateId: string
): Promise<PresignedPutResponse> {
	return getPresignedPutUrl({
		fileName,
		fileType,
		uploadType: 'certificate',
		metadata: {
			courseId,
			certificateId,
		},
	});
}

export async function uploadFileToCloudinary(
	file: File,
	params: PresignedPutResponse,
	onProgress?: (progress: number) => void,
): Promise<{ url: string; key: string }> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("api_key", params.apiKey);
	formData.append("timestamp", params.timestamp.toString());
	formData.append("signature", params.signature);
	formData.append("folder", params.folder);
	formData.append("public_id", params.publicId);
	formData.append("resource_type", params.resourceType);
	formData.append("type", "authenticated");
	formData.append("access_mode", "authenticated");

	const response = await axios.post(params.uploadUrl, formData, {
		onUploadProgress: (event) => {
			if (event.total && onProgress) {
				onProgress((event.loaded / event.total) * 100);
			}
		},
		headers: { "Content-Type": "multipart/form-data" },
	});

	return {
		url: response.data?.secure_url ?? "",
		key: response.data?.public_id ?? params.key,
	};
}

export async function getPresignedGetUrl(key: string, expiresInSeconds = 60): Promise<string> {
	if (/^https?:\/\//i.test(key)) {
		return key;
	}
	try {
		const response = await api.get<ApiResponse<PresignedGetResponse>>(
			"/files/get-presigned-url",
			{ params: { key, expiresInSeconds } }
		);
		return response.data.data.signedUrl;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message ||
				apiError.response?.data?.error ||
				"Failed to get signed URL"
		);
	}
}
