"use client";

import { useState, useCallback, useEffect } from "react";
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
	const [fileTypeError, setFileTypeError] = useState<string | null>(null);

	// Clear file type errors when accept prop changes
	useEffect(() => {
		setFileTypeError(null);
		// Clear the file if it's no longer valid with the new accept prop
		if (file && accept && accept !== "*/*") {
			const acceptedTypes = accept.split(",").map(type => type.trim());
			const isAccepted = acceptedTypes.some(acceptedType => {
				if (acceptedType.includes("*")) {
					const baseType = acceptedType.split("/")[0];
					return file.type.startsWith(baseType + "/");
				}
				return file.type === acceptedType;
			});
			
			if (!isAccepted) {
				setFile(null);
				setFileUrl("");
				if (onFileChange) onFileChange(null);
				if (onFileUrlChange) onFileUrlChange("");
			}
		}
	}, [accept, file, onFileChange, onFileUrlChange]);

	// Clear file if it exceeds the new maxSize
	useEffect(() => {
		if (file && file.size > maxSize) {
			setFile(null);
			setFileUrl("");
			setFileTypeError(null);
			if (onFileChange) onFileChange(null, `File exceeds maximum size (${(maxSize / (1024 * 1024)).toFixed(1)}MB)`);
			if (onFileUrlChange) onFileUrlChange("");
		}
	}, [maxSize, file, onFileChange, onFileUrlChange]);

	// Clear file type errors when external error changes
	useEffect(() => {
		if (error) {
			setFileTypeError(null);
		}
	}, [error]);

	// Clear file when upload is successful and clear file type errors for any status change
	useEffect(() => {
		if (uploadStatus === FileUploadStatus.SUCCESS) {
			setFile(null);
		}
		setFileTypeError(null);
	}, [uploadStatus]);

	// Handle file selection or change
	const handleFileChange = useCallback(
		(newFile: File | null) => {
			if (!newFile) {
				setFile(null);
				setFileTypeError(null);
				if (onFileChange) onFileChange(null);
				return;
			}

			// Validate file type based on accept prop
			if (accept && accept !== "*/*") {
				const acceptedTypes = accept.split(",").map(type => type.trim());
				const isAccepted = acceptedTypes.some(acceptedType => {
					if (acceptedType.includes("*")) {
						// Handle wildcard patterns like "image/*"
						const baseType = acceptedType.split("/")[0];
						return newFile.type.startsWith(baseType + "/");
					}
					return newFile.type === acceptedType;
				});
				
				if (!isAccepted) {
					const errorMessage = `File type ${newFile.type} is not allowed. Accepted types: ${acceptedTypes.join(", ")}`;
					setFileTypeError(errorMessage);
					if (onFileChange) onFileChange(null, errorMessage);
					return;
				}
			}

			// Clear any previous file type errors
			setFileTypeError(null);

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
			// Clear URL when file is selected
			setFileUrl("");
			if (onFileUrlChange) onFileUrlChange("");
			if (onFileChange) onFileChange(newFile);
		},
		[maxSize, onFileChange, accept],
	);

	// Handle URL input change
	const handleUrlChange = useCallback(
		(url: string) => {
			setFileUrl(url);
			// Clear file and file type errors when URL is entered
			if (url) {
				setFile(null);
				setFileTypeError(null);
				if (onFileChange) onFileChange(null);
			}
			if (onFileUrlChange) onFileUrlChange(url);
		},
		[onFileUrlChange, onFileChange],
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

	// Validate if a file type is accepted
	const isFileTypeAccepted = useCallback((file: File) => {
		if (!accept || accept === "*/*") return true;
		
		const acceptedTypes = accept.split(",").map(type => type.trim());
		return acceptedTypes.some(acceptedType => {
			if (acceptedType.includes("*")) {
				const baseType = acceptedType.split("/")[0];
				return file.type.startsWith(baseType + "/");
			}
			return file.type === acceptedType;
		});
	}, [accept]);

	// Get user-friendly file type labels
	const getAcceptedFileTypesLabel = useCallback(() => {
		if (!accept || accept === "*/*") return "any file type";
		
		const acceptedTypes = accept.split(",").map(type => type.trim());
		return acceptedTypes.map(type => {
			if (type.includes("*")) {
				const baseType = type.split("/")[0];
				return baseType + " files";
			}
			// Convert MIME types to readable names
			switch (type) {
				case "image/jpeg":
				case "image/jpg":
					return "JPEG images";
				case "image/png":
					return "PNG images";
				case "image/gif":
					return "GIF images";
				case "image/webp":
					return "WebP images";
				case "video/mp4":
					return "MP4 videos";
				case "video/webm":
					return "WebM videos";
				case "video/ogg":
					return "OGG videos";
				case "application/pdf":
					return "PDF documents";
				case "application/msword":
					return "Word documents";
				case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
					return "Word documents";
				default:
					return type;
			}
		}).join(", ");
	}, [accept]);

	// Format max size for display
	const formatMaxSize = useCallback(() => {
		if (maxSize >= 1024 * 1024) {
			return `${(maxSize / (1024 * 1024)).toFixed(1)}MB`;
		}
		return `${(maxSize / 1024).toFixed(1)}KB`;
	}, [maxSize]);

	// Handle drag over with file type validation
	const handleDragOverWithValidation = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		
		// Check if any of the dragged files are acceptable
		if (e.dataTransfer.items) {
			for (let i = 0; i < e.dataTransfer.items.length; i++) {
				const item = e.dataTransfer.items[i];
				if (item.kind === 'file') {
					const file = item.getAsFile();
					if (file && isFileTypeAccepted(file)) {
						setIsDragging(true);
						return;
					}
				}
			}
		}
	}, [isFileTypeAccepted]);

	const handleRemoveFile = useCallback(() => {
		setFile(null);
		setFileUrl("");
		setFileTypeError(null);
		if (onFileChange) onFileChange(null);
		if (onFileUrlChange) onFileUrlChange("");
	}, [onFileChange, onFileUrlChange]);

	const handleRemoveFileUrl = useCallback(() => {
		setFileUrl("");
		setFile(null);
		if (onFileUrlChange) onFileUrlChange("");
		if (onFileChange) onFileChange(null);
	}, [onFileUrlChange, onFileChange]);

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
				onDragOver={handleDragOverWithValidation}
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
								onClick={handleRemoveFile}
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
								<p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
									Accepted: {getAcceptedFileTypesLabel()}
								</p>
								<p className="text-xs text-gray-400 dark:text-gray-500">
									Max size: {formatMaxSize()}
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
						onClick={handleRemoveFileUrl}
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

			{fileTypeError && (
				<div className="mt-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
					<p className="text-sm text-red-600 dark:text-red-400 flex items-center">
						<XCircle className="h-4 w-4 mr-2" />
						{fileTypeError}
					</p>
				</div>
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
