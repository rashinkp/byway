"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { TableControls } from "@/components/ui/TableControls";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Video, Trash2, Edit } from "lucide-react";
import { LessonFormModal, LessonFormData } from "./LessonFormModal";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { useDeleteLesson } from "@/hooks/lesson/useDeleteLesson";
import { ILesson } from "@/types/lesson";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "../skeleton/DataTableSkeleton";
import { PaginationSkeleton } from "../skeleton/PaginationSkeleton";
import { Pagination } from "../ui/Pagination";
import { set } from "zod";



export function LessonManager({ courseId }: { courseId: string }) {
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'title'|'createdAt'|'order'>("order");
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PUBLISHED" | "DRAFT" | 'INACTIVE'
    >("ALL");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const limit = 10;

  const { data, isLoading, error, refetch } = useGetAllLessonsInCourse({
    courseId,
    page,
    limit,
    sortBy,
    sortOrder: sortOrder || 'asc',
    search: searchTerm,
    filterBy: filterStatus,
    includeDeleted: true,
  });

  const { mutate: deleteLesson, isPending: isDeleting } =
    useDeleteLesson(courseId);

  const nextOrder = data?.lessons.length
    ? Math.max(...data.lessons.map((l) => l.order)) + 1
    : 1;
  
  const totalPages = data?.totalPages || 1;

  const router = useRouter();

  const handleDeleteLesson = async (lesson: ILesson) => {
    deleteLesson(lesson.id, {
      onError: (err) => {
        console.error("Failed to delete lesson:", err);
      },
    });
  };



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
      onClick: (lesson: ILesson) => {
        console.log("view lesson:", lesson);
        router.push(
          `/instructor/courses/${lesson.courseId}/lessons/${lesson.id}`
        );
      },
      variant: () => "default" as const,
    },
    {
      label: (lesson: ILesson) => (lesson.deletedAt ? "Enable" : "Disable"),
      onClick: (lesson: ILesson) => handleDeleteLesson(lesson),
      variant: (lesson: ILesson) =>
        lesson.deletedAt ? "default" : "destructive",
      disabled: (lesson: ILesson) => !!lesson.deletedAt,
      confirmationMessage: (lesson: ILesson) =>
              lesson.deletedAt
                ? `Are you sure you want to enable the lesson "${lesson.title}"?`
                : `Are you sure you want to disable the lesson "${lesson.title}"?`,
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
        setFilterStatus={(status:string) => {
          setFilterStatus(status as "ALL" | "PUBLISHED" | "DRAFT" | 'INACTIVE');
          setPage(1);
       }} 
        sortBy={sortBy}
        setSortBy={(sort: "order" | "title" | "createdAt") => setSortBy(sort as 'title'|'createdAt')}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
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

      {isLoading ? (
        <TableSkeleton columns={3} hasActions={true} />
      ) : (
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
      )}


      {isLoading ? (
              <PaginationSkeleton />
            ) : totalPages > 1 ? (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            ) : null}

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
