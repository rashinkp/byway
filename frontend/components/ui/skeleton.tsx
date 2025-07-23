import { cn } from "@/utils/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-lg h-8 w-full bg-gray-200/80 relative overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
        style={{
          animation: "shimmer 1s infinite linear",
          transform: "translateX(-100%)",
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export { Skeleton };
