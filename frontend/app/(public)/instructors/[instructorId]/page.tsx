"use client";

import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Users, Globe } from "lucide-react";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { Course } from "@/types/course";
import { CourseCard } from "@/components/course/CourseCard";
import Link from "next/link";
import { useGetInstructorDetails } from "@/hooks/instructor/useGetInstructorDetails";
import { IInstructorDetails } from "@/types/instructor";

export default function InstructorDetailPage() {
  const params = useParams();
  const instructorId = params.instructorId as string;

  const {
    data: instructorData,
    isLoading: isInstructorLoading,
    error,
  } = useGetInstructorDetails(instructorId);

  const { data: coursesData, isLoading: isCoursesLoading } = useGetAllCourses({
    includeDeleted: false,
  });

  const instructor = instructorData?.data as IInstructorDetails;

  const instructorCourses = coursesData?.items;

  if (isInstructorLoading) {
    return (
      <div className="container mx-auto py-8 max-w-7xl px-4">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="container mx-auto py-8 max-w-7xl px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Instructor not found
          </h1>
          <p className="text-gray-600 mt-2">
            The instructor you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Parse certifications and education into arrays for rendering
  const certifications = instructor.certifications
    ? instructor.certifications
        .split("\n")
        .map((cert) => cert.replace("- ", "").trim())
        .filter(Boolean)
    : [];
  const education = instructor.education
    ? instructor.education
        .split("\n")
        .map((edu) => edu.replace("- ", "").trim())
        .filter(Boolean)
    : [];

  return (
    <div className="container mx-auto py-8 max-w-7xl px-4">
      {/* Instructor Profile Section */}
      <Card className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-semibold">
              {instructor.name.charAt(0) || "I"}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {instructor.name || "Instructor Name"}
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                {instructor.areaOfExpertise}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700">{instructor.about}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Badge variant="secondary" className="px-4 py-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {new Date(instructor.createdAt).toLocaleDateString()}
                </Badge>
                <Badge variant="secondary" className="px-4 py-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {instructorCourses?.length || 0} Courses
                </Badge>
                <Badge variant="secondary" className="px-4 py-1">
                  <Users className="w-4 h-4 mr-2" />
                  {instructor.totalStudents || 0} Students
                </Badge>
                {instructor.website && (
                  <Badge variant="secondary" className="px-4 py-1">
                    <Globe className="w-4 h-4 mr-2" />
                    <a
                      href={instructor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Website
                    </a>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Education */}
        {education.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Professional Experience */}
      {instructor.professionalExperience && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Professional Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{instructor.professionalExperience}</p>
          </CardContent>
        </Card>
      )}

      {/* Courses Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Courses by {instructor.name || "Instructor"}
        </h2>

        {isCoursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !instructorCourses?.length ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No courses available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorCourses.map((course: Course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <CourseCard
                  id={course.id}
                  thumbnail={course.thumbnail || ""}
                  title={course.title}
                  rating={course.rating || 0}
                  reviewCount={course.reviewCount || 0}
                  lessons={course.totalLessons || 0}
                  price={course.price || 0}
                  formattedDuration={`${course.duration || 0} hours`}
                  bestSeller={course.bestSeller || false}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
