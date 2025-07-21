import { Skeleton } from "@/components/ui/skeleton";

export function LessonListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-full bg-gray-100 dark:bg-[#232323]" />
      ))}
    </div>
  );
} 