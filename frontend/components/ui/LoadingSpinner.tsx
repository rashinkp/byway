import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	className?: string;
	text?: string;
	fullScreen?: boolean;
}

export function LoadingSpinner({
	size = "md",
	className,
	text,
	fullScreen = false,
}: LoadingSpinnerProps) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	const content = (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-4",
				className,
			)}
		>
			<Loader2 className={cn("animate-spin text-[var(--color-primary-dark)]", sizeClasses[size])} />
			{text && (
				<p className="text-sm text-[var(--color-muted)] animate-pulse">{text}</p>
			)}
		</div>
	);

	if (fullScreen) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-[var(--color-background)]/80 backdrop-blur-sm">
				{content}
			</div>
		);
	}

	return content;
}
