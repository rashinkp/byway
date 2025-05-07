import { Star } from "lucide-react";
import UserProfile from "@/public/UserProfile.jpg";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseInfoProps {
  course: any;
  instructor: any;
  lessonsLength: number | undefined;
  courseLoading: boolean;
  instructorLoading: boolean;
}

export default function CourseInfo({
  course,
  instructor,
  lessonsLength,
  courseLoading,
  instructorLoading,
}: CourseInfoProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i < Math.floor(rating) ? "#FFD700" : "none"}
          color={i < Math.floor(rating) ? "#FFD700" : "#D1D5DB"}
        />
      );
    }
    return stars;
  };

  if (courseLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <span className="mx-1">|</span>
          <Skeleton className="h-4 w-16" />
          <span className="mx-1">|</span>
          <Skeleton className="h-4 w-16" />
          <span className="mx-1">|</span>
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 rounded-full mr-3" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
      <p className="text-gray-700 mb-4">{course?.description}</p>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-bold text-amber-500">4.6</span>
        <div className="flex">{renderStars(4.6)}</div>
        <span className="text-gray-600">(167,593 rating)</span>
        <span className="mx-1">|</span>
        <span>{course?.duration} Total Hours</span>
        <span className="mx-1">|</span>
        <span>{lessonsLength} Lectures</span>
        <span className="mx-1">|</span>
        <span>{course?.level}</span>
      </div>
      {instructorLoading ? (
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 rounded-full mr-3" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : (
        <div className="flex items-center mb-6">
          <img
            src={instructor?.avatar || UserProfile.src}
            alt={instructor?.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <span>Created by </span>
            <a href="#" className="text-blue-600 font-medium">
              {instructor?.name}
            </a>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 mb-6">
        <span className="flex items-center gap-1">
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200">
            <span className="text-xs">🌐</span>
          </span>
        </span>
        English
      </div>
    </div>
  );
}
