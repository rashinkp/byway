"use client";
import { useState } from "react";
import { ChevronDown, Star, Clock, Users, BookOpen } from "lucide-react";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useParams } from "next/navigation";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useGetPublicLessons } from "@/hooks/lesson/useGetPublicLessons";
import { useGetPublicUser } from "@/hooks/user/useGetPublicUser";
import UserProfile from "@/public/UserProfile.jpg";
import { Skeleton } from "@/components/ui/skeleton";

// ... (CourseInstructor, CourseModule, CourseData interfaces remain unchanged)

export default function CourseDetail() {
  const [activeTab, setActiveTab] = useState("description");
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const { courseId } = useParams();
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useGetCourseById(courseId as string);
  const {
    data,
    isLoading: lessonLoading,
    error: lessonError,
  } = useGetPublicLessons({ courseId: courseId as string });
  const {
    data: instructor,
    isLoading: instructorLoading,
    error: instructorError,
  } = useGetPublicUser(course?.createdBy as string);

  const lessons = data?.lessons;

  const toggleModule = (moduleTitle: string) => {
    if (expandedModules.includes(moduleTitle)) {
      setExpandedModules(
        expandedModules.filter((title) => title !== moduleTitle)
      );
    } else {
      setExpandedModules([...expandedModules, moduleTitle]);
    }
  };

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

  if (courseError || instructorError || lessonError) {
    return (
      <ErrorDisplay
        error={courseError || instructorError || lessonError}
        title="course error"
      />
    );
  }

  if (courseLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex text-sm text-gray-500 mb-4">
          <Skeleton className="h-4 w-20" />
          <span className="mx-2">›</span>
          <Skeleton className="h-4 w-24" />
          <span className="mx-2">›</span>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
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
            <div className="border-b mb-6">
              <div className="flex gap-6">
                {["Description", "Instructor", "Syllabus", "Reviews"].map(
                  (tab) => (
                    <Skeleton key={tab} className="h-6 w-24 py-3" />
                  )
                )}
              </div>
            </div>
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="lg:w-1/3">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex text-sm text-gray-500 mb-4">
        <span>Home</span>
        <span className="mx-2">›</span>
        <span>Categories</span>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{course?.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
          <p className="text-gray-700 mb-4">{course?.description}</p>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="font-bold text-amber-500">4.6</span>
            <div className="flex">{renderStars(4.6)}</div>
            <span className="text-gray-600">(167,593 rating)</span>
            <span className="mx-1">|</span>
            <span>{course?.duration} Total Hours</span>
            <span className="mx-1">|</span>
            <span>{lessons?.length} Lectures</span>
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
          <div className="border-b mb-6">
            <div className="flex gap-6">
              {["Description", "Instructor", "Syllabus", "Reviews"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`py-3 px-1 ${
                      activeTab === tab.toLowerCase()
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="mb-6">
            {activeTab === "description" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Course Description</h2>
                <p className="mb-6">{course?.details?.longDescription}</p>
                <h2 className="text-xl font-bold mb-4">Certification</h2>
                <p>
                  At Finway, we understand the significance of formal
                  recognition for your hard work and dedication to continuous
                  learning...
                </p>
              </div>
            )}
            {activeTab === "instructor" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Instructor</h2>
                {instructorLoading ? (
                  <div className="flex items-start gap-4 mb-6">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-32" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={instructor?.avatar || UserProfile.src}
                      alt={instructor?.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-blue-600">
                        {instructor?.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{instructor?.bio}</p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star size={16} />
                          <span>40,440 Reviews</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>500 Students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen size={16} />
                          <span>15 Courses</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{instructor?.bio}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "syllabus" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Syllabus</h2>
                {lessonLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessons?.map((lesson, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden"
                      >
                        <button
                          className="w-full flex justify-between items-center p-4 bg-gray-50"
                          onClick={() => toggleModule(lesson.title)}
                        >
                          <div className="flex items-center gap-2">
                            <ChevronDown
                              size={20}
                              className={`transform transition-transform ${
                                expandedModules.includes(lesson.title)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                            <span className="font-medium">{lesson.title}</span>
                          </div>
                          <div className="text-gray-500 text-sm">
                            {lesson.order}
                          </div>
                        </button>
                        {expandedModules.includes(lesson.title) && (
                          <div className="p-4 bg-white">
                            <p className="text-gray-600">
                              {lesson.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
          <div className="sticky top-4">
            <div className="aspect-w-16 aspect-h-12 relative">
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
                  <span className="text-gray-500 line-through">
                    ${course?.price}
                  </span>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white font-medium py-3 rounded mb-2 hover:bg-blue-700 transition">
                Add To Cart
              </button>
              <button className="w-full border border-gray-300 text-gray-800 font-medium py-3 rounded hover:bg-gray-50 transition">
                Buy Now
              </button>
              {/* <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Length:</span>
                  <span className="font-medium">{course?.duration} Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lectures:</span>
                  <span className="font-medium">{lessons?.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{course?.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Languages:</span>
                  <span className="font-medium">1</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
