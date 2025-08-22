import { GeneratePresignedUrlParams, PresignedPutResponse, PresignedGetResponse } from "@/types/file";
import { api } from "./api";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";

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

export function uploadFileToS3(
	file: File,
	presignedUrl: string,
	onProgress?: (progress: number) => void,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		xhr.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable && onProgress) {
				const progress = (event.loaded / event.total) * 100;
				onProgress(progress);
			}
		});

		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve();
			} else {
				reject(new Error(`Upload failed with status ${xhr.status}`));
			}
		});

		xhr.addEventListener("error", () => {
			reject(new Error("Upload failed"));
		});

		xhr.addEventListener("abort", () => {
			reject(new Error("Upload aborted"));
		});

		xhr.open("PUT", presignedUrl);
		xhr.setRequestHeader("Content-Type", file.type);
		xhr.send(file);
	});
}

export async function getPresignedGetUrl(key: string, expiresInSeconds = 60): Promise<string> {
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
