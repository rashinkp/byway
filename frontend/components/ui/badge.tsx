import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-lg border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-[var(--color-primary-dark)] focus-visible:ring-[var(--color-primary-dark)]/50 focus-visible:ring-[3px] aria-invalid:ring-[var(--color-danger)]/20 dark:aria-invalid:ring-[var(--color-danger)]/40 aria-invalid:border-[var(--color-danger)] transition-[color,box-shadow] overflow-hidden",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-[var(--color-primary-dark)] text-[var(--color-surface)] [a&]:hover:bg-[var(--color-primary-light)]",
				secondary:
					"border-transparent bg-[var(--color-primary-light)] text-[var(--color-surface)] [a&]:hover:bg-[var(--color-primary-dark)]",
				destructive:
					"border-transparent bg-[var(--color-danger)] text-[var(--color-surface)] [a&]:hover:bg-[var(--color-danger)]/90 focus-visible:ring-[var(--color-danger)]/20 dark:focus-visible:ring-[var(--color-danger)]/40 dark:bg-[var(--color-danger)]/60",
				outline:
					"text-[var(--color-primary-dark)] [a&]:hover:bg-[var(--color-accent)] [a&]:hover:text-[var(--color-surface)]",
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
