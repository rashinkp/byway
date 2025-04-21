"use client";

import { CourseFormData, courseSchema } from "@/app/instructor/courses/page";
import { useCreateCourse } from "@/hooks/course/useCreateCourse";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { FormModal, FormFieldConfig } from "../ui/FormModal";
import { useCategories } from "@/hooks/category/useCategories";
import { useMemo } from "react";

export const fields: FormFieldConfig<CourseFormData>[] = [
  {
    name: "title",
    label: "Title",
    type: "input",
    fieldType: "text",
    placeholder: "e.g., Introduction to Web Development",
    description: "Enter the title of your course.",
    maxLength: 100,
    column: "left",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "e.g., Learn the basics of HTML, CSS, and JavaScript",
    description: "Provide a brief description of the course (optional).",
    maxLength: 1000,
    column: "right",
  },
  {
    name: "categoryId",
    label: "Category",
    type: "select",
    placeholder: "Select a category",
    description: "Choose the category that best fits your course.",
    options: [],
    column: "left",
  },
  {
    name: "price",
    label: "Price (USD)",
    type: "input",
    fieldType: "number",
    placeholder: "e.g., 49.99",
    description: "Set the price for your course.",
    maxLength: 10,
    column: "right",
  },
  {
    name: "duration",
    label: "Duration",
    type: "input",
    fieldType: "number",
    placeholder: "e.g., 15 hours",
    description: "Specify the total duration of the course.",
    maxLength: 50,
    column: "left",
  },
  {
    name: "level",
    label: "Level",
    type: "select",
    placeholder: "Select a level",
    description: "Choose the difficulty level of the course.",
    options: [
      { value: "BEGINNER", label: "Beginner" },
      { value: "MEDIUM", label: "Intermediate" },
      { value: "ADVANCED", label: "Advanced" },
    ],
    column: "right",
  },
  {
    name: "thumbnail",
    label: "Thumbnail URL",
    type: "input",
    fieldType: "text",
    placeholder: "e.g., https://example.com/thumbnail.jpg",
    description: "Provide a URL for the course thumbnail (optional).",
    maxLength: 200,
    column: "left",
  },
];

interface CourseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CourseFormData) => Promise<void>;
  initialData?: Partial<CourseFormData>;
  isSubmitting?: boolean;
}

export function CourseFormModal({
  open,
  onOpenChange,
  onSubmit: externalOnSubmit,
  initialData,
  isSubmitting,
}: CourseFormModalProps) {
  const { user } = useAuthStore();
  const { mutate: createCourse, isPending } = useCreateCourse();
  const { categories, loading: categoriesLoading } = useCategories();

  const dynamicFields = useMemo(() => {
    return fields.map((field) =>
      field.name === "categoryId"
        ? {
            ...field,
            options:
              categories?.map((category) => ({
                value: category.id,
                label: category.name,
              })) || [],
          }
        : field
    );
  }, [categories]);

  const handleSubmit = async (data: CourseFormData) => {
    if (!user?.id) {
      toast.error("Instructor ID not found");
      return;
    }

    const submitData = {
      ...data,
      price: Number(data.price),
    };

    if (externalOnSubmit) {
      await externalOnSubmit(submitData);
    } else {
      createCourse(submitData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      schema={courseSchema}
      initialData={initialData}
      title={initialData ? "Edit Course" : "Create New Course"}
      submitText="Save"
      fields={dynamicFields}
      description={
        initialData
          ? "Update your course details."
          : "Create a new course by filling out the details."
      }
      isSubmitting={isSubmitting || isPending || categoriesLoading}
    />
  );
}
