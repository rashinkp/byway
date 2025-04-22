"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { TableControls } from "@/components/ui/TableControls";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Video, Trash2, Edit } from "lucide-react";
import { LessonFormModal, LessonFormData } from "./LessonFormModal";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { useCreateLesson } from "@/hooks/lesson/useCreateLesson";
import { useUpdateLesson } from "@/hooks/lesson/useUpdateLesson";
import { useDeleteLesson } from "@/hooks/lesson/useDeleteLesson";
import { ILesson } from "@/types/lesson";
import { useRouter } from "next/navigation";

type SortBy = "createdAt"  | "updatedAt";


export function LessonManager({ courseId }: { courseId: string }) {
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
   const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PUBLISHED" | "DRAFT"
  >("ALL");
  const limit = 10;

  const { data, isLoading, error, refetch } = useGetAllLessonsInCourse({
    courseId,
    page,
    limit,
    sortBy,
    sortOrder: "asc",
    search: searchTerm,
    filterBy: filterStatus,
    includeDeleted: true,
  });

  const { mutate: deleteLesson, isPending: isDeleting } =
    useDeleteLesson(courseId);
  
  const nextOrder = data?.lessons.length
    ? Math.max(...data.lessons.map((l) => l.order)) + 1
    : 1;
  
   const router = useRouter();

  const handleDeleteLesson = async (lesson: ILesson) => {
    deleteLesson(lesson.id, {
      onError: (err) => {
        console.error("Failed to delete lesson:", err);
      },
    });
  };

  // Wrapper for setFilterStatus to match TableControls' expected type
  const handleSetFilterStatus = (status: string) => {
    if (["DRAFT", "PUBLISHED", "ALL"].includes(status)) {
      setFilterStatus(status as "DRAFT" | "PUBLISHED" | "ALL");
    }
  };

   const handleSetSortBy = useCallback((sort: string) => {
      const validSorts: SortBy[] = ["createdAt", "updatedAt"];
      const newSort = validSorts.includes(sort as SortBy)
        ? (sort as SortBy)
        : "createdAt"; // Fallback to "createdAt" if invalid
      setSortBy(newSort);
    }, []);

  // Table columns
  const columns = [
    {
      header: "Title",
      accessor: "title" as keyof ILesson,
      render: (lesson: ILesson) =>
        lesson.title || <span className="text-gray-400">N/A</span>,
    },
    {
      header: "Description",
      accessor: "description" as keyof ILesson,
      render: (lesson: ILesson) =>
        lesson.description ? `${lesson.description}` : "N/A",
    },
    {
      header: "Order",
      accessor: "order" as keyof ILesson,
      render: (lesson: ILesson) => lesson.order,
    },
    {
      header: "Status",
      accessor: "deletedAt" as keyof ILesson,
      render: (lesson: ILesson) => <StatusBadge isActive={!lesson.deletedAt} />,
    },
  ];

  // Table actions
  const actions = [
    {
        label: () => "View",
        onClick: (lesson: ILesson ) => {
          console.log("view lesson:", lesson);
          router.push(`/instructor/courses/${lesson.courseId}/lessons/${lesson.id}`);
        },
        variant: () => "default" as const,
      },
    {
      label: (lesson: ILesson) => (lesson.deletedAt ? "Restore" : "Delete"),
      onClick: (lesson: ILesson) => handleDeleteLesson(lesson),
      variant: (lesson: ILesson) =>
              lesson.deletedAt ? "default" : "destructive",
      disabled: (lesson: ILesson) => !!lesson.deletedAt,
    },
  ];

  if (error) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Lessons</h2>
        <Button
          onClick={() => {
            setEditingLesson(null);
            setIsLessonModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Video className="mr-2 h-4 w-4" />
          Add Lesson
        </Button>
      </div>

      <TableControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={handleSetFilterStatus} // Use wrapper
        sortBy={sortBy}
        setSortBy={handleSetSortBy}
        sortOptions={[
          { value: "title", label: "Title (A-Z)" },
          { value: "order", label: "Order" },
          { value: "createdAt", label: "Created At" },
        ]}
        onRefresh={refetch}
        filterTabs={[
          { value: "ALL", label: "All" },
          { value: "PUBLISHED", label: "Published" },
          { value: "DRAFT", label: "Draft" },
        ]}
      />

      <DataTable<ILesson>
        data={data?.lessons || []}
        columns={columns}
        isLoading={isLoading}
        actions={actions}
        itemsPerPage={limit}
        totalItems={data?.total || 0}
        currentPage={page}
        setCurrentPage={setPage}
      />

      <LessonFormModal
        open={isLessonModalOpen}
        onOpenChange={setIsLessonModalOpen}
        initialData={
          editingLesson
            ? {
                title: editingLesson.title,
                description: editingLesson.description || "",
                order: editingLesson.order,
                thumbnail: editingLesson.thumbnail || "",
              }
            : undefined
        }
        nextOrder={nextOrder}
        courseId={courseId}
      />
    </div>
  );
}
