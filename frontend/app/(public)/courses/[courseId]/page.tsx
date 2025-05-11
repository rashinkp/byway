"use client";
import { useState, useEffect } from "react";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useGetPublicLessons } from "@/hooks/lesson/useGetPublicLessons";
import { useGetPublicUser } from "@/hooks/user/useGetPublicUser";
import { useParams } from "next/navigation";
import CourseBreadcrumbs from "@/components/course/courseDetail/CourseBreadcrumbs";
import CourseInfo from "@/components/course/courseDetail/CourseInfo";
import CourseTabs from "@/components/course/courseDetail/CourseTabs";
import CourseDescription from "@/components/course/courseDetail/CourseDescription";
import CourseInstructor from "@/components/course/courseDetail/CourseInstructor";
import CourseSyllabus from "@/components/course/courseDetail/CourseSyllabus";
import CourseSidebar from "@/components/course/courseDetail/CourseSidebar";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/hooks/cart/useAddToCart";

export default function CourseDetail() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("description");
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
    data,
    isLoading: lessonLoading,
    error: lessonError,
  } = useGetPublicLessons(
    { courseId: courseId as string }
  );

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

  if (courseError || instructorError || lessonError) {
    return (
      <ErrorDisplay
        error={courseError || instructorError || lessonError}
        title="course error"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <CourseBreadcrumbs course={course} isLoading={courseLoading} />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <CourseInfo
            course={course}
            instructor={instructor}
            lessonsLength={data?.lessons.length}
            courseLoading={courseLoading}
            instructorLoading={instructorLoading}
          />
          <CourseTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoading={courseLoading}
          />
          <div className="mb-6">
            {activeTab === "description" && (
              <CourseDescription course={course} isLoading={courseLoading} />
            )}
            {activeTab === "instructor" && (
              <CourseInstructor
                instructor={instructor}
                isLoading={instructorLoading}
              />
            )}
            {activeTab === "syllabus" && (
              <>
                {!user && (
                  <div className="p-4 bg-gray-100 rounded-md">
                    <p className="text-lg">
                      Please{" "}
                      <a href="/login" className="text-blue-600 underline">
                        log in
                      </a>{" "}
                      to view the course syllabus.
                    </p>
                  </div>
                )}
                {user && (
                  <CourseSyllabus
                    lessons={data?.lessons}
                    isLoading={lessonLoading}
                  />
                )}
              </>
            )}
            {activeTab === "reviews" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                <p>Course reviews would appear here.</p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:w-1/4">
          <CourseSidebar
            course={course}
            isLoading={courseLoading || userLoading}
            isCartLoading={isCartLoading}
            handleAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}
