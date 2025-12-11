import { useState } from "react";
import { getPresignedPutUrl, uploadFileToCloudinary } from "@/api/file";

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
	) => Promise<string>; // returns Cloudinary secure URL
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
			const uploadParams = await getPresignedPutUrl({
				fileName: file.name,
				fileType: file.type,
				uploadType,
				metadata,
			});

			// Upload file to Cloudinary
			const uploadResult = await uploadFileToCloudinary(
				file,
				uploadParams,
				(progress) => setProgress(progress)
			);

			return uploadResult.url || uploadResult.key;
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
