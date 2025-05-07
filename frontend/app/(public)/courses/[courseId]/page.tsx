"use client";
import { useState } from "react";
import { ChevronDown, Star, Clock, Users, BookOpen } from "lucide-react";
import { useGetCourseById } from "@/hooks/course/useGetCourseById";
import { useParams } from "next/navigation";
import ErrorDisplay from "@/components/ErrorDisplay";

interface CourseInstructor {
  name: string;
  title: string;
  avatar: string;
  reviews: number;
  students: number;
  courses: number;
  bio: string;
}

interface CourseModule { 
  title: string;
  lessons: number;
  hours: number;
}

interface CourseData {
  title: string;
  description: string;
  rating: number;
  reviewCount: number;
  totalHours: number;
  lectures: number;
  level: string;
  instructor: CourseInstructor;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  languages: string[];
  modules: CourseModule[];
  certificationInfo: string;
}

const courseData: CourseData = {
  title: "Introduction to User Experience Design",
  description:
    "This course is meticulously crafted to provide you with a foundational understanding of the principles, methodologies, and tools that drive exceptional user experiences in the digital landscape.",
  rating: 4.6,
  reviewCount: 167593,
  totalHours: 22,
  lectures: 155,
  level: "All levels",
  price: 49.5,
  originalPrice: 99,
  discountPercentage: 50,
  languages: ["English", "Spanish", "Italian", "German"],
  instructor: {
    name: "Ronald Richards",
    title: "UI/UX Designer",
    avatar: "/api/placeholder/64/64",
    reviews: 40440,
    students: 500,
    courses: 15,
    bio: "With over a decade of industry experience, Ronald brings a wealth of practical knowledge to the classroom. He has played a pivotal role in designing user-centric interfaces for renowned tech companies, ensuring seamless and engaging user experiences.",
  },
  modules: [
    {
      title: "Introduction to UX Design",
      lessons: 5,
      hours: 1,
    },
    {
      title: "Basics of User-Centered Design",
      lessons: 5,
      hours: 1,
    },
    {
      title: "Elements of User Experience",
      lessons: 5,
      hours: 1,
    },
  ],
  certificationInfo:
    "At Finway, we understand the significance of formal recognition for your hard work and dedication to continuous learning. Upon successful completion of our course, you will earn a prestigious certification that not only validates your expertise but also opens doors to new opportunities in your chosen field.",
};

// Course Detail Component
export default function CourseDetail() {
  const [activeTab, setActiveTab] = useState("description");
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const { courseId } = useParams();
  const { data: course, isLoading, error } = useGetCourseById(courseId as string);
  
  

  const toggleModule = (moduleTitle: string) => {
    if (expandedModules.includes(moduleTitle)) {
      setExpandedModules(
        expandedModules.filter((title) => title !== moduleTitle)
      );
    } else {
      setExpandedModules([...expandedModules, moduleTitle]);
    }
  };

  // Render star ratings
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

  if (error) {
    return <ErrorDisplay  error={error} title="course error"/>
  }

  if (isLoading) {
    return (
      <div>Loading.....</div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumbs */}
      <div className="flex text-sm text-gray-500 mb-4">
        <span>Home</span>
        <span className="mx-2">›</span>
        <span>Categories</span>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{course?.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Course info */}
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>

          <p className="text-gray-700 mb-4">{course?.description}</p>

          {/* Rating and course stats */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="font-bold text-amber-500">
              {courseData.rating}
            </span>
            <div className="flex">{renderStars(courseData.rating)}</div>
            <span className="text-gray-600">
              ({courseData.reviewCount.toLocaleString()} rating)
            </span>
            <span className="mx-1">|</span>
            <span>{course?.duration} Total Hours</span>
            <span className="mx-1">|</span>
            <span>{courseData.lectures} Lectures</span>
            <span className="mx-1">|</span>
            <span>{course?.level}</span>
          </div>

          {/* Instructor brief */}
          <div className="flex items-center mb-6">
            <img
              src={courseData.instructor.avatar}
              alt={courseData.instructor.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <span>Created by </span>
              <a href="#" className="text-blue-600 font-medium">
                {courseData.instructor.name}
              </a>
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-2 mb-6">
            <span className="flex items-center gap-1">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200">
                <span className="text-xs">🌐</span>
              </span>
            </span>
            English
          </div>

          {/* Tabs */}
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

          {/* Tab Content */}
          <div className="mb-6">
            {activeTab === "description" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Course Description</h2>
                <p className="mb-6">
                  {course?.details?.longDescription}
                </p>

                <h2 className="text-xl font-bold mb-4">Certification</h2>
                <p>{courseData.certificationInfo}</p>
              </div>
            )}

            {activeTab === "instructor" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Instructor</h2>

                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={courseData.instructor.avatar}
                    alt={courseData.instructor.name}
                    className="w-16 h-16 rounded-full"
                  />

                  <div>
                    <h3 className="text-lg font-bold text-blue-600">
                      {courseData.instructor.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {courseData.instructor.title}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star size={16} />
                        <span>
                          {courseData.instructor.reviews.toLocaleString()}{" "}
                          Reviews
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{courseData.instructor.students} Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen size={16} />
                        <span>{courseData.instructor.courses} Courses</span>
                      </div>
                    </div>

                    <p className="text-gray-700">{courseData.instructor.bio}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "syllabus" && (
              <div>
                
                <h2 className="text-xl font-bold mb-4">Syllabus</h2>

                <div className="space-y-4">
                  {courseData.modules.map((module, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full flex justify-between items-center p-4 bg-gray-50"
                        onClick={() => toggleModule(module.title)}
                      >
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            size={20}
                            className={`transform transition-transform ${
                              expandedModules.includes(module.title)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                          <span className="font-medium">{module.title}</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                          {module.lessons} Lessons · {module.hours} hour
                        </div>
                      </button>

                      {expandedModules.includes(module.title) && (
                        <div className="p-4 bg-white">
                          <p className="text-gray-600">
                            Module content would appear here
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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

        {/* Right column - Course card */}
        <div className="lg:w-1/3">
          <div className="sticky top-4 border rounded-lg overflow-hidden shadow-md">
            <div className="aspect-w-16 aspect-h-12 relative">
              <img
                src={course?.thumbnail || ''}
                alt="Course Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    ${course?.offer}
                  </span>
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

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Length:</span>
                  <span className="font-medium">
                    {course?.duration} Hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lectures:</span>
                  <span className="font-medium">{courseData.lectures}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{course?.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Languages:</span>
                  <span className="font-medium">
                    {1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
