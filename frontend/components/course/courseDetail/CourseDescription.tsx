import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CourseDescriptionProps {
  course: any;
  isLoading: boolean;
}

export default function CourseDescription({
  course,
  isLoading,
}: CourseDescriptionProps) {
  if (isLoading) {
    return (
      <div className="py-4">
        <LoadingSpinner size="sm" text="Loading description..." />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Course Description</h2>
      <p className="mb-6">{course?.details?.longDescription}</p>
      <h2 className="text-xl font-bold mb-4">Certification</h2>
      <p>
        At Finway, we understand the significance of formal recognition for your
        hard work and dedication to continuous learning...
      </p>
    </div>
  );
}
