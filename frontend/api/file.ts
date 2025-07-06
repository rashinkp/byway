import { api } from "./api";

interface PresignedUrlResponse {
	uploadUrl: string;
	fileUrl: string;
}

interface ApiResponse<T> {
	statusCode: number;
	success: boolean;
	message: string;
	data: T;
}

export async function getPresignedUrl(
	fileName: string,
	fileType: string,
): Promise<PresignedUrlResponse> {
	try {
		const response = await api.post<ApiResponse<PresignedUrlResponse>>(
			"/files/generate-presigned-url",
			{
				fileName,
				fileType,
			},
		);
		return response.data.data;
	} catch (error: any) {
		console.error("Get presigned URL error:", {
			status: error.response?.status,
			data: error.response?.data,
			message: error.message,
		});
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Failed to get presigned URL",
		);
	}
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
