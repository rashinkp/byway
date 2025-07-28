import { useState, useCallback } from "react";
import { Upload, File, CheckCircle, XCircle } from "lucide-react";
import { getPresignedUrl, getCoursePresignedUrl, uploadFileToS3 } from "@/api/file";

interface ThumbnailUploadInputProps {
	file: File | null;
	setFile: (file: File | null) => void;
	fileUrl: string;
	setFileUrl: (fileUrl: string) => void;
	uploadStatus: "idle" | "uploading" | "success" | "error";
	uploadProgress: number;
	setUploadStatus: (status: "idle" | "uploading" | "success" | "error") => void;
	setUploadProgress: (progress: number) => void;
	errors: { thumbnail?: string };
	courseId?: string;
}

export const ThumbnailUploadInput = ({
	file,
	setFile,
	fileUrl,
	setFileUrl,
	uploadStatus,
	uploadProgress,
	setUploadStatus,
	setUploadProgress,
	errors,
	courseId,
}: ThumbnailUploadInputProps) => {
	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const droppedFile = e.dataTransfer.files[0];
			setFile(droppedFile);
		}
	};

	// S3 upload logic
	const uploadToS3 = useCallback(
		async (file: File): Promise<string> => {
			setUploadStatus("uploading");
			setUploadProgress(0);
			try {
				let uploadUrl: string;
				let fileUrl: string;
				
				if (courseId) {
					// Use course-specific upload for thumbnail
					const response = await getCoursePresignedUrl(
						file.name,
						file.type,
						courseId,
						'thumbnail'
					);
					uploadUrl = response.uploadUrl;
					fileUrl = response.fileUrl;
				} else {
					// Fallback to generic upload (for backward compatibility)
					const response = await getPresignedUrl({
						fileName: file.name,
						fileType: file.type,
						uploadType: 'course',
						metadata: {
							contentType: 'thumbnail',
						},
					});
					uploadUrl = response.uploadUrl;
					fileUrl = response.fileUrl;
				}
				
				await uploadFileToS3(file, uploadUrl, setUploadProgress);
				setUploadStatus("success");
				return fileUrl;
			} catch (error) {
				setUploadStatus("error");
				throw error;
			}
		},
		[setUploadStatus, setUploadProgress, courseId],
	);

	// Expose uploadToS3 as a static method for ContentInputForm
	(ThumbnailUploadInput as any).uploadToS3 = uploadToS3;

	return (
		<div className="space-y-3">
			<label className="block text-sm font-semibold text-black dark:text-white">
				Thumbnail Image
			</label>

			<div
				className={`relative p-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
					isDragging
						? "border-[#facc15] bg-[#facc15]/20"
						: errors.thumbnail
							? "border-red-300 bg-red-50"
							: "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#232323] hover:border-[#facc15] hover:bg-[#facc15]/10"
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<div className="flex flex-col items-center justify-center py-4 space-y-4">
					{file ? (
						<div className="flex items-center space-x-3 bg-[#facc15]/20 px-4 py-2 rounded-lg">
							<File className="h-6 w-6 text-[#facc15]" />
							<span className="text-sm font-medium text-black dark:text-white max-w-xs truncate">
								{file.name}
							</span>
							<button
								type="button"
								onClick={() => setFile(null)}
								className="text-red-500 hover:text-red-700"
							>
								<XCircle className="h-5 w-5" />
							</button>
						</div>
					) : (
						<>
							<Upload className="h-12 w-12 text-[#facc15]" />
							<div className="text-center">
								<p className="text-black dark:text-white font-medium">
									Drag & drop your thumbnail (JPEG, PNG, WebP)
								</p>
								<p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
									or click to browse files
								</p>
							</div>
						</>
					)}

					<input
						type="file"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						accept="image/jpeg,image/png,image/webp"
					/>
				</div>
			</div>

			<div className="relative">
				<input
					type="text"
					value={fileUrl}
					onChange={(e) => setFileUrl(e.target.value)}
					className={`w-full p-3 pr-10 border rounded-xl bg-white dark:bg-[#232323] text-black dark:text-white focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] transition-all duration-300 ${
						errors.thumbnail ? "border-red-300" : "border-gray-200 dark:border-gray-700"
					}`}
					placeholder="Or enter thumbnail URL"
				/>
				{fileUrl && (
					<button
						type="button"
						onClick={() => setFileUrl("")}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
					>
						<XCircle className="h-5 w-5" />
					</button>
				)}
			</div>

			{errors.thumbnail && (
				<p className="mt-1 text-sm text-red-500 flex items-center">
					<XCircle className="h-4 w-4 mr-1" />
					{errors.thumbnail}
				</p>
			)}

			{uploadStatus === "uploading" && (
				<div className="mt-2">
					<div className="flex justify-between text-sm mb-1">
						<span className="text-[#facc15] font-medium">Uploading...</span>
						<span className="text-gray-600">{Math.round(uploadProgress)}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-[#facc15] h-2 rounded-full transition-all duration-300"
							style={{ width: `${uploadProgress}%` }}
						></div>
					</div>
					<p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
						Please do not refresh the page
					</p>
				</div>
			)}

			{uploadStatus === "success" && (
				<p className="mt-2 text-sm text-green-600 flex items-center">
					<CheckCircle className="h-4 w-4 mr-1" />
					Upload Complete
				</p>
			)}

			{uploadStatus === "error" && (
				<p className="mt-2 text-sm text-red-500 flex items-center">
					<XCircle className="h-4 w-4 mr-1" />
					Upload Failed
				</p>
			)}
		</div>
	);
};
