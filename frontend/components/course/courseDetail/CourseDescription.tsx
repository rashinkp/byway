import { Skeleton } from "@/components/ui/skeleton";

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
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
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
