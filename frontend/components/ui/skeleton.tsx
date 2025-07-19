// Skeleton component uses --color-primary-light for its background to ensure visibility and contrast on light backgrounds.
// Adjust the variable in globals.css if you want to change the skeleton color globally.
import { cn } from "@/utils/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				// Base styles: themed background, rounded corners
				"rounded-lg h-8 w-full bg-yellow-300 dark:bg-yellow-100/60",
				className,
			)}
			{...props}
		/>
	);
}

export { Skeleton };
