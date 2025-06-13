"use client";

import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Globe, 
  GraduationCap, 
  Award, 
  Briefcase,
  Mail,
  Loader2,
  FileText,
} from "lucide-react";
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
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">Instructor Not Found</div>
            <p className="text-gray-600">The instructor you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold">
                  {instructor.name.charAt(0) || "I"}
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">{instructor.name}</h1>
                <p className="text-gray-600">{instructor.areaOfExpertise}</p>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline"
                    className="capitalize bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {new Date(instructor.createdAt).toLocaleDateString()}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    {instructorCourses?.length || 0} Courses
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {instructor.totalStudents || 0} Students
                  </Badge>
                </div>
              </div>
            </div>
            {instructor.website && (
              <Badge 
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                <Globe className="w-3 h-3 mr-1" />
                <a
                  href={instructor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Visit Website
                </a>
              </Badge>
            )}
          </div>
        </Card>

        {/* Main Content Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="p-6 space-y-6">
            {/* About Section */}
            <div className="flex items-center gap-2 text-gray-900">
              <FileText className="w-5 h-5" />
              <h2 className="text-lg font-semibold">About</h2>
            </div>
            <Separator />
            <p className="text-gray-800 leading-relaxed">
              {instructor.about || (
                <span className="italic text-gray-400">
                  No description provided yet
                </span>
              )}
            </p>

            {/* Contact Information */}
            <div className="flex items-center gap-2 text-gray-900">
              <Mail className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {instructor.email && (
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Email</h3>
                    <p className="text-gray-800">{instructor.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Education */}
            {education.length > 0 && (
              <>
                <div className="flex items-center gap-2 text-gray-900">
                  <GraduationCap className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Education</h2>
                </div>
                <Separator />
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-gray-800">{edu}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <>
                <div className="flex items-center gap-2 text-gray-900">
                  <Award className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Certifications</h2>
                </div>
                <Separator />
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Award className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-gray-800">{cert}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Professional Experience */}
            {instructor.professionalExperience && (
              <>
                <div className="flex items-center gap-2 text-gray-900">
                  <Briefcase className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Professional Experience</h2>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-gray-800">{instructor.professionalExperience}</p>
                </div>
              </>
            )}

            {/* Courses Section */}
            <div className="flex items-center gap-2 text-gray-900">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Courses by {instructor.name}</h2>
            </div>
            <Separator />
            {isCoursesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="p-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
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
        </Card>
      </div>
    </div>
  );
}
