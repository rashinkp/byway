import { cn } from "@/utils/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // Base styles: muted background, rounded corners, overflow hidden for animation
        "relative overflow-hidden bg-muted rounded-lg",
        // Shimmer effect: gradient with a subtle white highlight, moving horizontally
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:blur-sm",
        // Ensure the skeleton has a default size if not provided
        "h-8 w-full",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };