"use client";

import { Course } from "@/types/course";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";
import { StatusBadge } from "@/components/ui/StatusBadge";
import ListPage from "@/components/ListingPage";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { CourseApprovalModal } from "@/components/course/CourseApprovalModal";
import { useApproveCourse, useDeclineCourse } from "@/hooks/course/useApproveCourse";

interface CourseAction {
  label: string | ((course: Course) => string);
  onClick: (course: Course) => void;
  variant:
    | "outline"
    | "default"
    | "destructive"
    | ((course: Course) => "outline" | "default" | "destructive");
  confirmationMessage?: (course: Course) => string;
  hidden?: (course: Course) => boolean;
}

export default function CoursesPage() {
  const { mutate: toggleDeleteCourse } = useSoftDeleteCourse();
  const { mutate: approveCourse } = useApproveCourse();
  const { mutate: declineCourse } = useDeclineCourse();
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "ADMIN";

  return (
    <ListPage<Course>
      title="Course Management"
      description="Manage courses and their visibility"
      entityName="Course"
      role={user?.role}
      useDataHook={(params) =>
        useGetAllCourses({
          ...params,
          sortBy: params.sortBy as
            | "title"
            | "createdAt"
            | "updatedAt"
            | "price"
            | "duration",
          role: user?.role,
        })
      }
      columns={[
        {
          header: "Title",
          accessor: "title",
          render: (course) =>
            course.title ? (
              <span>{course.title}</span>
            ) : (
              <span className="text-gray-400">N/A</span>
            ),
        },
        {
          header: "Instructor",
          accessor: "createdBy",
          render: (course) =>
            course.createdBy ? (
              <span>{course.createdBy}</span>
            ) : (
              <span className="text-gray-400">N/A</span>
            ),
        },
        {
          header: "Approval Status",
          accessor: "approvalStatus",
          render: (course) => (
            <Badge
              variant={
                course.approvalStatus === "APPROVED"
                  ? "default"
                  : course.approvalStatus === "PENDING"
                  ? "secondary"
                  : "destructive"
              }
            >
              {course.approvalStatus}
            </Badge>
          ),
        },
        {
          header: "Status",
          accessor: "deletedAt",
          render: (course) => <StatusBadge isActive={!course.deletedAt} />,
        },
      ]}
      actions={[
        {
          label: "View",
          onClick: (course) => {
            interface CourseAction {
              label: string | ((course: Course) => string);
              onClick: (course: Course) => void;
              variant: string | ((course: Course) => string);
              confirmationMessage?: (course: Course) => string;
              hidden?: (course: Course) => boolean;
            }

                        router.push(`/admin/courses/${course.id}`);
                      },
                      variant: "outline",
                    } as CourseAction,
                    {
                      label: (course: Course) => (course.deletedAt ? "Enable" : "Disable"),
                      onClick: (course: Course) => toggleDeleteCourse(course),
                      variant: (course: Course) => (course.deletedAt ? "default" : "destructive"),
                      confirmationMessage: (course: Course) =>
                        course.deletedAt
                          ? `Are you sure you want to enable the course "${course.title}"?`
                          : `Are you sure you want to disable the course "${course.title}"?`,
                    } as CourseAction,
                    
      ]}
      extraButtons={
        isAdmin ? [<CourseApprovalModal key="course-approval-modal" />] : []
      }
      stats={(courses, total) => [
        { title: "Total Courses", value: total },
        {
          title: "Active Courses",
          value: courses.filter((course) => !course.deletedAt).length,
          color: "text-green-600",
        },
        {
          title: "Inactive Courses",
          value: courses.filter((course) => course.deletedAt).length,
          color: "text-red-600",
        },
        {
          title: "Pending Approvals",
          value: courses.filter((course) => course.approvalStatus === "PENDING")
            .length,
          color: "text-yellow-600",
        },
        {
          title: "Declined Courses",
          value: courses.filter(
            (course) => course.approvalStatus === "DECLINED"
          ).length,
          color: "text-red-600",
        },
      ]}
      sortOptions={[
        { value: "title", label: "Title" },
        { value: "createdAt", label: "Newest first" },
        { value: "approvalStatus", label: "Approval Status" },
      ]}
      defaultSortBy="title"
      addButton={{
        label: "Add Course",
        onClick: () => router.push("/admin/courses/new"),
      }}
    />
  );
}
