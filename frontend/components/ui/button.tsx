import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#facc15]/50 focus-visible:ring-offset-2 shadow-sm border-0",
	{
		variants: {
			variant: {
				default:
					"bg-[#facc15] text-black hover:bg-black hover:text-[#facc15] border-none dark:bg-[#18181b] dark:text-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black",
				primary:
					"bg-[#facc15]  text-black border-none ",
				secondary:
					"bg-white text-[#18181b] hover:bg-[#facc15] hover:text-black border border-[#18181b] dark:bg-[#18181b] dark:text-white dark:hover:bg-[#facc15] dark:hover:text-black dark:border-white",
				ghost:
					"bg-transparent text-black dark:hover:text-[#facc15] border-none dark:text-white dark:hover:text-[#facc15]",
				link: "text-[#18181b] hover:text-[#facc15] bg-transparent border-none dark:text-white dark:hover:text-[#facc15]",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
