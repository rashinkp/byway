import React, { useCallback, useRef } from "react";
import { useFileUpload } from "@/hooks/file/useFileUpload";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { cn } from "@/utils/cn";
import ErrorDisplay from "@/components/ErrorDisplay";

interface FileUploadProps {
	onUploadComplete: (key: string) => void;
	onUploadError?: (error: string) => void;
	accept?: string;
	maxSize?: number; // in bytes
	className?: string;
	disabled?: boolean;
	description?: string;
	label?: string;
}

export function FileUpload({
	onUploadComplete,
	onUploadError,
	accept,
	maxSize = 10 * 1024 * 1024, // 10MB default
	className,
	disabled = false,
	description,
	label = "Upload File",
}: FileUploadProps) {
	const { uploadFile, progress, isUploading, error } = useFileUpload();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			if (file.size > maxSize) {
				const errorMessage = `File size exceeds ${maxSize / (1024 * 1024)}MB limit`;
				onUploadError?.(errorMessage);
				return;
			}

			try {
				const key = await uploadFile(file);
				onUploadComplete(key);
			} catch (err) {
				onUploadError?.(err instanceof Error ? err.message : "Upload failed");
			}
		},
		[uploadFile, maxSize, onUploadComplete, onUploadError],
	);

	return (
		<div className={cn("space-y-2", className)}>
			{label && (
				<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black dark:text-white">
					{label}
				</label>
			)}

			{description && (
				<p className="text-sm text-[#facc15]">{description}</p>
			)}

			<div className="flex items-center gap-4">
				<Input
					ref={fileInputRef}
					type="file"
					onChange={handleFileChange}
					accept={accept}
					disabled={disabled || isUploading}
					className="flex-1 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#facc15]/10 file:text-[#facc15] hover:file:bg-[#facc15]/20 border border-[#facc15] bg-white/80 dark:bg-[#232323] text-black dark:text-white"
				/>
				<Button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					disabled={disabled || isUploading}
					size="sm"
					className="border-[#facc15] text-black  bg-[#facc15] hover:bg-black hover:text-[#facc15] dark:bg-[#facc15] dark:text-black dark:hover:bg-black dark:hover:text-[#facc15]"
				>
					<Upload className="w-4 h-4 mr-2 text-black dark:text-[#18181b]" />
					{isUploading ? "Uploading..." : "Browse"}
				</Button>
			</div>

			{isUploading && (
				<div className="space-y-2">
					<Progress
						value={progress}
						className="w-full h-2 bg-[#facc15]/20 [&_.bg-primary]:bg-[#facc15]"
					/>
					<p className="text-sm text-[#facc15]">
						Uploading... {Math.round(progress)}%
					</p>
				</div>
			)}

			{error && (
				<ErrorDisplay
					error={error}
					title="File Upload Error"
					description="There was a problem uploading your file. Please try again."
					compact
				/>
			)}
		</div>
	);
}
