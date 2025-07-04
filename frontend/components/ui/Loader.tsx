import { Loader2 } from "lucide-react";

interface LoaderProps {
	size?: number;
	className?: string;
}

export function Loader({ size = 24, className }: LoaderProps) {
	return (
		<Loader2 className={`animate-spin text-primary ${className}`} size={size} />
	);
}
