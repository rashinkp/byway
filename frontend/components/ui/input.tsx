import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-black placeholder:text-neutral-400 selection:bg-[#facc15] selection:text-black border border-[#18181b] flex h-10 w-full min-w-0 rounded-lg bg-white px-4 py-2 text-base text-black transition-all duration-300 outline-none shadow-sm focus-visible:border-[#facc15] focus-visible:ring-2 focus-visible:ring-[#facc15]/20 hover:border-[#facc15] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-600 aria-invalid:ring-red-600/20 dark:bg-neutral-900 dark:text-white dark:border-white dark:placeholder-gray-400",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
