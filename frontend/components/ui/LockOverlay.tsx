import { Lock } from "lucide-react";

interface LockOverlayProps {
	message?: string;
}

export function LockOverlay({
	message = "Complete previous lessons to unlock",
}: LockOverlayProps) {
	return (
		<div className="absolute inset-0 bg-[var(--color-primary-dark)]/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
			<div className="bg-[var(--color-surface)]/80 p-6 rounded-lg flex flex-col items-center gap-4 border border-[var(--color-primary-light)]/20">
				<Lock className="w-12 h-12 text-[var(--color-primary-light)]" />
				<p className="text-[var(--color-primary-dark)] text-lg font-medium">
					{message}
				</p>
			</div>
		</div>
	);
}
