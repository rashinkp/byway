import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="flex text-sm text-gray-500 mb-4">
        <Skeleton className="h-4 w-20" />
        <span className="mx-2">›</span>
        <Skeleton className="h-4 w-24" />
        <span className="mx-2">›</span>
        <Skeleton className="h-4 w-32" />
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
