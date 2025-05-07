import { Skeleton } from "@/components/ui/skeleton";

interface CourseSidebarProps {
  course: any;
  isLoading: boolean;
}

export default function CourseSidebar({
  course,
  isLoading,
}: CourseSidebarProps) {
  if (isLoading) {
    return (
      <div className="sticky top-4 border rounded-lg overflow-hidden shadow-md">
        <Skeleton className="w-full h-48" />
        <div className="p-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-4 ">
      <div className="aspect-w-16 aspect-h-10 relative">
        <img
          src={course?.thumbnail || ""}
          alt="Course Preview"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${course?.offer}</span>
            <span className="text-gray-500 line-through">${course?.price}</span>
          </div>
        </div>
        <button className="w-full bg-blue-600 text-white font-medium py-3 rounded mb-2 hover:bg-blue-700 transition">
          Add To Cart
        </button>
        <button className="w-full border border-gray-300 text-gray-800 font-medium py-3 rounded hover:bg-gray-50 transition">
          Buy Now
        </button>
      </div>
    </div>
  );
}
