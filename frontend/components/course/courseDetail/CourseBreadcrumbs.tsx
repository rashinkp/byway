import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CourseBreadcrumbsProps {
  course: any;
  isLoading: boolean;
}

export default function CourseBreadcrumbs({
  course,
  isLoading,
}: CourseBreadcrumbsProps) {
  if (isLoading) {
    return (
      <div className="py-4">
        <LoadingSpinner size="sm" text="Loading course details..." />
      </div>
    );
  }

  return (
    <div className="flex text-sm text-gray-500 mb-4">
      <span>Home</span>
      <span className="mx-2">›</span>
      <span>Categories</span>
      <span className="mx-2">›</span>
      <span className="text-gray-700">{course?.title}</span>
    </div>
  );
}
