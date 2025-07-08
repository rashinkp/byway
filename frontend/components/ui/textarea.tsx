import * as React from "react";

import { cn } from "@/utils/cn";
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"border-[var(--color-primary-light)] placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-primary-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-dark)]/20 aria-invalid:ring-[var(--color-danger)]/20 dark:aria-invalid:ring-[var(--color-danger)]/40 aria-invalid:border-[var(--color-danger)] dark:bg-[var(--color-surface)] flex min-h-[80px] w-full rounded-lg bg-transparent px-4 py-2 text-base transition-all duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
