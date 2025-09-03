import { useState } from "react";
import { getPresignedPutUrl, uploadFileToS3 } from "@/api/file";

interface UseFileUploadReturn {
	uploadFile: (
		file: File,
		uploadType?: 'course' | 'profile' | 'certificate' | 'chat',
		metadata?: {
			courseId?: string;
			userId?: string;
			certificateId?: string;
			contentType?: 'thumbnail' | 'video' | 'document' | 'avatar' | 'cv';
		}
	) => Promise<string>; // returns S3 key
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
		uploadType: 'course' | 'profile' | 'certificate' | 'chat' = 'course',
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

			// Get presigned PUT URL and key
			const { uploadUrl, key } = await getPresignedPutUrl({
				fileName: file.name,
				fileType: file.type,
				uploadType,
				metadata,
			});

			// Upload file to S3
			await uploadFileToS3(file, uploadUrl, (progress) => {
				setProgress(progress);
			});

			return key;
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
