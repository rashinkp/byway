import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-[var(--color-primary-dark)] placeholder:text-[var(--color-muted)] selection:bg-[var(--color-primary-dark)] selection:text-[var(--color-surface)] border border-[var(--color-primary-light)] flex h-10 w-full min-w-0 rounded-lg bg-transparent px-4 py-2 text-base transition-all duration-300 outline-none file:inline-flex file:items-center file:justify-center file:rounded-md file:border-0 file:bg-[var(--color-primary-light)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-surface)] focus-visible:border-[var(--color-primary-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-dark)]/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--color-danger)] aria-invalid:ring-[var(--color-danger)]/20",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
