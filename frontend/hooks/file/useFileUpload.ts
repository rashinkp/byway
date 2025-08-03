import { useState } from "react";
import { getPresignedUrl, uploadFileToS3 } from "@/api/file";

interface UseFileUploadReturn {
	uploadFile: (
		file: File,
		uploadType?: 'course' | 'profile' | 'certificate',
		metadata?: {
			courseId?: string;
			userId?: string;
			certificateId?: string;
			contentType?: 'thumbnail' | 'video' | 'document' | 'avatar' | 'cv';
		}
	) => Promise<string>;
	progress: number;
	isUploading: boolean;
	error: string | null;
	reset: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
	const [progress, setProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const reset = () => {
		setProgress(0);
		setIsUploading(false);
		setError(null);
	};

	const uploadFile = async (
		file: File,
		uploadType: 'course' | 'profile' | 'certificate' = 'course',
		metadata?: {
			courseId?: string;
			userId?: string;
			certificateId?: string;
			contentType?: 'thumbnail' | 'video' | 'document' | 'avatar' | 'cv';
		}
	): Promise<string> => {
		try {
			setIsUploading(true);
			setError(null);

			// Get presigned URL
			const { uploadUrl, fileUrl } = await getPresignedUrl({
				fileName: file.name,
				fileType: file.type,
				uploadType,
				metadata,
			});

			// Upload file to S3
			await uploadFileToS3(file, uploadUrl, (progress) => {
				setProgress(progress);
			});

			return fileUrl;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Upload failed";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setIsUploading(false);
		}
	};

	return {
		uploadFile,
		progress,
		isUploading,
		error,
		reset,
	};
}
