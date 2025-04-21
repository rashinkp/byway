import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { TableControls } from "@/components/ui/TableControls";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Video, Trash2, Edit } from "lucide-react";
import { LessonFormModal, LessonFormData } from "./LessonFormModal";

// Dummy lesson type (replace with real type)
interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: number;
  videoUrl?: string;
  order: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Dummy lesson data
const dummyLessons: Lesson[] = [
  {
    id: "lesson-1",
    title: "Getting Started with HTML",
    description: "Learn the basics of HTML structure and tags.",
    duration: 30,
    videoUrl: "https://example.com/video1.mp4",
    order: 1,
    courseId: "course-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "lesson-2",
    title: "Styling with CSS",
    description: "Explore CSS properties and layouts.",
    duration: 45,
    videoUrl: "https://example.com/video2.mp4",
    order: 2,
    courseId: "course-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function LessonManager({ courseId }: { courseId: string }) {
  const [lessons, setLessons] = useState<Lesson[]>(dummyLessons);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "order" | "createdAt">(
    "order"
  );
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Published" | "Draft"
  >("All");

  // Mock API functions (replace with real API calls)
  const handleAddLesson = async (data: LessonFormData) => {
    const newLesson: Lesson = {
      id: `lesson-${lessons.length + 1}`,
      ...data,
      courseId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLessons((prev) => [...prev, newLesson]);
  };

  const handleEditLesson = async (data: LessonFormData) => {
    if (!editingLesson) return;
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === editingLesson.id
          ? { ...lesson, ...data, updatedAt: new Date().toISOString() }
          : lesson
      )
    );
  };

  const handleDeleteLesson = async (lesson: Lesson) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lesson.id ? { ...l, deletedAt: new Date().toISOString() } : l
      )
    );
  };

  // Table columns
  const columns = [
    {
      header: "Title",
      accessor: "title" as keyof Lesson,
      render: (lesson: Lesson) =>
        lesson.title || <span className="text-gray-400">N/A</span>,
    },
    {
      header: "Duration",
      accessor: "duration" as keyof Lesson,
      render: (lesson: Lesson) => `${lesson.duration} min`,
    },
    {
      header: "Order",
      accessor: "order" as keyof Lesson,
      render: (lesson: Lesson) => lesson.order,
    },
    {
      header: "Status",
      accessor: "status" as keyof Lesson,
      render: (lesson: Lesson) => <StatusBadge isActive={!lesson.deletedAt} />,
    },
  ];

  // Table actions
  const actions = [
    {
      label: () => "Edit",
      onClick: (lesson: Lesson) => {
        setEditingLesson(lesson);
        setIsLessonModalOpen(true);
      },
      variant: () => "default" as const,
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: () => "Delete",
      onClick: (lesson: Lesson) => handleDeleteLesson(lesson),
      variant: () => "destructive" as const,
      icon: <Trash2 className="h-4 w-4" />,
    },
  ];

  // Filter and sort lessons
  const filteredLessons = lessons
    .filter((lesson) => !lesson.deletedAt)
    .filter((lesson) =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "order") return a.order - b.order;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

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
        setFilterStatus={(status: string) =>
          setFilterStatus(status as "All" | "Published" | "Draft")
        }
        sortBy={sortBy}
        setSortBy={(sort: string) =>
          setSortBy(sort as "title" | "order" | "createdAt")
        }
        sortOptions={[
          { value: "title", label: "Title (A-Z)" },
          { value: "order", label: "Order" },
          { value: "createdAt", label: "Created At" },
        ]}
        onRefresh={() => console.log("Refresh lessons")} // Replace with API refetch
        filterTabs={[
          { value: "All", label: "All" },
          { value: "Published", label: "Published" },
          { value: "Draft", label: "Draft" },
        ]}
      />

      <DataTable<Lesson>
        data={filteredLessons}
        columns={columns}
        isLoading={false}
        actions={actions}
        itemsPerPage={10}
        totalItems={filteredLessons.length}
        currentPage={1}
        setCurrentPage={() => {}} // Add pagination if needed
      />

      <LessonFormModal
        open={isLessonModalOpen}
        onOpenChange={setIsLessonModalOpen}
        onSubmit={editingLesson ? handleEditLesson : handleAddLesson}
        initialData={editingLesson || undefined}
        isSubmitting={false} // Add loading state for API calls
      />
    </div>
  );
}
