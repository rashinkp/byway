"use client";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useGetPublicLessons } from "@/hooks/lesson/useGetPublicLessons";
import { useGetPublicUser } from "@/hooks/user/useGetPublicUser";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { User } from "@/types/user";
import CourseDetailLayout from "./CourseDetailLayout";

export default function MainCourseDetailsContent() {
  const router = useRouter();
  const { courseId } = useParams();
  const { user, isLoading: userLoading } = useAuth();
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useGetCourseById(courseId as string);
  const {
    data: instructor,
    isLoading: instructorLoading,
    error: instructorError,
  } = useGetPublicUser(course?.createdBy as string);
  const {
    data: lessonsData,
    isLoading: lessonLoading,
    error: lessonError,
  } = useGetPublicLessons({ courseId: courseId as string });

  const { mutate: addToCart, isPending: isCartLoading } = useAddToCart();

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (course?.id) {
      addToCart({ courseId: course.id });
    }
  };

  const error = courseError || instructorError || lessonError;

  if (error) {
    return <ErrorDisplay error={error} title="course error" />;
  }

  return (
    <div className="bg-white dark:bg-[#18181b] min-h-screen p-0">
      <CourseDetailLayout
        course={course}
        instructor={instructor as User}
        lessons={lessonsData?.lessons}
        isLoading={{
          course: courseLoading,
          instructor: instructorLoading,
          lessons: lessonLoading,
          user: userLoading,
        }}
        error={error}
        sidebarProps={{
          isCartLoading,
          handleAddToCart,
          isEnrolled: course?.isEnrolled || false,
          userLoading,
        }}
        showReviews={true}
      />
    </div>
  );
}
