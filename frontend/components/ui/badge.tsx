import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-colors border-none",
	{
		variants: {
			variant: {
				default:
					"bg-[#18181b] text-white border-none",
				primary:
					"bg-[#facc15] text-black border-none",
				secondary:
					"bg-white text-[#18181b] border border-[#18181b]",
				destructive:
					"bg-red-600 text-white border-none",
				outline:
					"bg-transparent text-[#18181b] border border-[#18181b]",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant,
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return (
		<span
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
