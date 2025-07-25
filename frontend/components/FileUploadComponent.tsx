"use client";

import { useState, useCallback } from "react";
import { Upload, File, XCircle, CheckCircle } from "lucide-react";
import ErrorDisplay from "@/components/ErrorDisplay";

export enum FileUploadStatus {
	IDLE = "idle",
	UPLOADING = "uploading",
	SUCCESS = "success",
	ERROR = "error",
}

interface FileUploadComponentProps {
	label?: string;
	accept?: string;
	maxSize?: number;
	onFileChange?: (file: File | null, error?: string) => void;
	onFileUrlChange?: (url: string) => void;
	error?: string;
	uploadStatus?: FileUploadStatus;
	uploadProgress?: number;
	fileTypeLabel?: string;
}

export default function FileUploadComponent({
	accept = "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	maxSize = 10 * 1024 * 1024, // 10MB default
	onFileChange,
	onFileUrlChange,
	error,
	uploadStatus = FileUploadStatus.IDLE,
	uploadProgress = 0,
	fileTypeLabel = "file",
}: FileUploadComponentProps) {
	const [file, setFile] = useState<File | null>(null);
	const [fileUrl, setFileUrl] = useState<string>("");
	const [isDragging, setIsDragging] = useState<boolean>(false);

	// Handle file selection or change
	const handleFileChange = useCallback(
		(newFile: File | null) => {
			if (!newFile) {
				setFile(null);
				if (onFileChange) onFileChange(null);
				return;
			}

			// Validate file size
			if (newFile.size > maxSize) {
				if (onFileChange)
					onFileChange(
						null,
						`File exceeds maximum size (${(maxSize / (1024 * 1024)).toFixed(
							1,
						)}MB)`,
					);
				return;
			}

			setFile(newFile);
			if (onFileChange) onFileChange(newFile);
		},
		[maxSize, onFileChange],
	);

	// Handle URL input change
	const handleUrlChange = useCallback(
		(url: string) => {
			setFileUrl(url);
			if (onFileUrlChange) onFileUrlChange(url);
		},
		[onFileUrlChange],
	);

	// Handle drag events
	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const droppedFile = e.dataTransfer.files?.[0];
			if (droppedFile) {
				handleFileChange(droppedFile);
			}
		},
		[handleFileChange],
	);

	return (
		<div className="space-y-3">
			<div
				className={`relative p-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
					isDragging
						? "border-[#facc15] bg-[#facc15]/10"
						: error
							? "border-red-400 bg-red-50 dark:bg-red-900/30"
							: "border-[#facc15] bg-white dark:bg-[#18181b] hover:border-[#facc15] hover:bg-[#facc15]/10 dark:hover:bg-[#facc15]/10"
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
								onClick={() => handleFileChange(null)}
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
									Drag & drop your {fileTypeLabel} here
								</p>
								<p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
									or click to browse files
								</p>
							</div>
						</>
					)}

					<input
						type="file"
						onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						accept={accept}
					/>
				</div>
			</div>

			<div className="relative">
				<input
					type="text"
					value={fileUrl}
					onChange={(e) => handleUrlChange(e.target.value)}
					className={`w-full p-3 pr-10 border rounded-xl bg-white dark:bg-[#18181b] text-black dark:text-white focus:ring-2 focus:ring-[#facc15] focus:border-[#facc15] transition-all duration-300 ${
						error ? "border-red-400" : "border-[#facc15]"
					}`}
					placeholder="Or enter file URL"
				/>
				{fileUrl && (
					<button
						type="button"
						onClick={() => handleUrlChange("")}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
					>
						<XCircle className="h-5 w-5" />
					</button>
				)}
			</div>

			{error && (
				<ErrorDisplay
					error={error}
					title="File Upload Error"
					description="There was a problem with your file upload. Please try again."
					compact
				/>
			)}

			{uploadStatus === FileUploadStatus.UPLOADING && (
				<div className="mt-2">
					<div className="flex justify-between text-sm mb-1">
						<span className="text-[#facc15] font-medium">Uploading...</span>
						<span className="text-black dark:text-white">{Math.round(uploadProgress)}%</span>
					</div>
					<div className="w-full bg-[#facc15]/20 rounded-full h-2">
						<div
							className="bg-[#facc15] h-2 rounded-full transition-all duration-300"
							style={{ width: `${uploadProgress}%` }}
						></div>
					</div>
					<p className="text-xs text-gray-500 mt-1">
						Please do not refresh the page
					</p>
				</div>
			)}

			{uploadStatus === FileUploadStatus.SUCCESS && (
				<p className="mt-2 text-sm text-green-600 flex items-center">
					<CheckCircle className="h-4 w-4 mr-1" />
					Upload Complete
				</p>
			)}

			{uploadStatus === FileUploadStatus.ERROR && (
				<p className="mt-2 text-sm text-red-500 flex items-center">
					<XCircle className="h-4 w-4 mr-1" />
					Upload Failed
				</p>
			)}
		</div>
	);
}
