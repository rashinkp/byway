import { cn } from "@/utils/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Base styles: themed background, rounded corners, overflow hidden for animation
        "relative overflow-hidden bg-[var(--primary-200)] rounded-lg",
        // Shimmer effect: gradient with a subtle highlight, moving horizontally
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-[var(--primary-400)]/30 before:to-transparent before:blur-sm",
        // Ensure the skeleton has a default size if not provided
        "h-8 w-full",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };