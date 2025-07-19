import React, { FC, ReactNode, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
	error: any;
	onRetry?: () => void;
	title?: string;
	description?: string;
	statusCode?: number | string;
	children?: ReactNode;
	compact?: boolean; // If true, render inline/compact version
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({
	error,
	onRetry,
	title = "Something Went Wrong",
	description = "An error occurred while processing your request. Please try again.",
	statusCode,
	children,
	compact = false,
}) => {
	const errorMessage =
		error?.message ||
		(typeof error === "string" ? error : "An unexpected error occurred");
	const code = statusCode || error?.status || error?.statusCode;
	const errorRef = useRef<HTMLDivElement>(null);

	// Focus error for accessibility
	useEffect(() => {
		if (errorRef.current) {
			errorRef.current.focus();
		}
	}, []);

	if (compact) {
		return (
			<div
				ref={errorRef}
				tabIndex={-1}
				role="alert"
				className="w-full flex items-center justify-center mb-6"
				aria-live="assertive"
			>
				<div className="inline-flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-neutral-900 border border-red-600 dark:border-red-400 rounded-lg px-4 py-3 text-sm font-medium shadow-sm max-w-md">
					<AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
					<div className="flex flex-col items-start">
						<span className="font-semibold">{title}</span>
						<span className="text-red-600 dark:text-red-400 font-normal">
							{errorMessage}
						</span>
					</div>
					{onRetry && (
						<button
							onClick={onRetry}
							className="ml-2 underline text-[#facc15] hover:text-black dark:hover:text-white text-xs"
							aria-label="Retry the action"
						>
							Retry
						</button>
					)}
				</div>
				{children}
			</div>
		);
	}

	return (
		<div
			ref={errorRef}
			tabIndex={-1}
			role="alert"
			aria-live="assertive"
			className="container mx-auto max-w-2xl px-4 py-8 min-h-screen flex items-center justify-center"
		>
			<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-8 w-full text-center border border-red-600 dark:border-red-400">
				<div className="flex justify-center mb-6">
					<AlertCircle
						size={48}
						className="text-red-600 dark:text-red-400"
						aria-hidden="true"
					/>
				</div>
				<h1 className="text-2xl font-bold text-black dark:text-white mb-2">
					{title}
				</h1>
				{code && (
					<div className="text-sm text-red-600 dark:text-red-400 mb-2">
						Error Code: {code}
					</div>
				)}
				<p className="text-gray-500 dark:text-gray-400 mb-4">{description}</p>
				<p className="text-[var(--color-danger)] font-medium mb-6" role="alert">
					Error: <span className="text-red-600 dark:text-red-400">{errorMessage}</span>
				</p>
				{onRetry && (
					<button
						onClick={onRetry}
						className="inline-flex items-center px-6 py-3 bg-[#facc15] text-black rounded-md font-medium hover:bg-black hover:text-[#facc15] dark:bg-[#18181b] dark:text-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black focus:ring-2 focus:ring-[#facc15] focus:outline-none transition-colors"
						aria-label="Retry the action"
					>
						Retry
					</button>
				)}
				{children}
			</div>
		</div>
	);
};

export default ErrorDisplay;
