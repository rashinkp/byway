"use client";

import { CourseFormData } from "@/types/course";
import { useCreateCourse } from "@/hooks/course/useCreateCourse";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { FormModal, FormFieldConfig } from "../ui/FormModal";
import { useCategories } from "@/hooks/category/useCategories";
import { useMemo, useState } from "react";
import { courseSchema } from "@/lib/validations/course";
import { FileUploadStatus } from "../FileUploadComponent";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const fields: FormFieldConfig<CourseFormData>[] = [
  {
    name: "title",
    label: "Course Title",
    type: "input",
    fieldType: "text",
    placeholder: "e.g., Introduction to Web Development",
    description: "Enter the title of your course (max 100 characters).",
    maxLength: 100,
  },
  {
    name: "description",
    label: "Short Description",
    type: "textarea",
    placeholder: "e.g., Learn the basics of HTML, CSS, and JavaScript",
    description: "Provide a brief overview of the course (max 1000 characters).",
    maxLength: 1000,
  },
  {
    name: "longDescription",
    label: "Detailed Description",
    type: "textarea",
    placeholder: "e.g., In-depth explanation of course content and structure",
    description: "Provide a detailed description of the course (max 5000 characters).",
    maxLength: 5000,
  },
  {
    name: "categoryId",
    label: "Category",
    type: "select",
    placeholder: "Select a category",
    description: "Choose the category that best fits your course.",
    options: [],
  },
  {
    name: "price",
    label: "Price (USD)",
    type: "input",
    fieldType: "number",
    placeholder: "e.g., 49.99",
    description: "Set the price for your course (optional).",
  },
  {
    name: "offer",
    label: "Discounted Price (USD)",
    type: "input",
    fieldType: "number",
    placeholder: "e.g., 39.99",
    description: "Set a discounted price for promotions (optional).",
  },
  {
    name: "duration",
    label: "Duration (Hours)",
    type: "input",
    fieldType: "number",
    placeholder: "e.g., 15",
    description: "Specify the total duration of the course in hours.",
  },
  {
    name: "level",
    label: "Difficulty Level",
    type: "select",
    placeholder: "Select a level",
    description: "Choose the difficulty level of the course.",
    options: [
      { value: "BEGINNER", label: "Beginner" },
      { value: "MEDIUM", label: "Intermediate" },
      { value: "ADVANCED", label: "Advanced" },
    ],
  },
  {
    name: "prerequisites",
    label: "Prerequisites",
    type: "textarea",
    placeholder: "e.g., Basic knowledge of programming",
    description: "List any prerequisites for the course (optional, max 1000 characters).",
    maxLength: 1000,
  },
  {
    name: "objectives",
    label: "Learning Objectives",
    type: "textarea",
    placeholder: "e.g., Understand core web development concepts",
    description: "List the learning objectives of the course (optional, max 2000 characters).",
    maxLength: 2000,
  },
  {
    name: "targetAudience",
    label: "Target Audience",
    type: "textarea",
    placeholder: "e.g., Aspiring web developers",
    description: "Describe the intended audience for the course (optional, max 1000 characters).",
    maxLength: 1000,
  },
  {
    name: "thumbnail",
    label: "Thumbnail",
    type: "input",
    fieldType: "file",
    description: "Upload a thumbnail image for the course.",
    accept: "image/*",
    maxSize: 5 * 1024 * 1024, // 5MB
    fileTypeLabel: "image",
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
  const { data, isLoading: categoriesLoading } = useCategories();
  const categories = data?.items;
  const [thumbnailUploadStatus, setThumbnailUploadStatus] =
    useState<FileUploadStatus>(FileUploadStatus.IDLE);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);

  const dynamicFields = useMemo(() => {
    return fields.map((field) => {
      if (field.name === "categoryId") {
        return {
          ...field,
          options:
            categories?.map((category) => ({
              value: category.id,
              label: category.name,
            })) || [],
        };
      }

      if (field.name === "thumbnail") {
        return {
          ...field,
          disabled: !!initialData?.thumbnail,
          uploadStatus: initialData?.thumbnail
            ? FileUploadStatus.SUCCESS
            : thumbnailUploadStatus,
          uploadProgress: initialData?.thumbnail ? 100 : thumbnailUploadProgress,
        };
      }

      return field;
    });
  }, [
    categories,
    initialData,
    thumbnailUploadStatus,
    thumbnailUploadProgress,
  ]);

  const handleSubmit = async (data: CourseFormData) => {
    if (!user?.id) {
      toast.error("Instructor ID not found");
      return;
    }

    let thumbnailUrl: string | undefined;

    try {
      // Handle thumbnail upload to Cloudinary
      if (data.thumbnail instanceof File) {
        setThumbnailUploadStatus(FileUploadStatus.UPLOADING);
        const uploadResult = await uploadToCloudinary(data.thumbnail, {
          folder: "courses",
          onProgress: (progress) => {
            setThumbnailUploadProgress(progress.percent);
          },
        });
        thumbnailUrl = uploadResult.secure_url;
        setThumbnailUploadStatus(FileUploadStatus.SUCCESS);
      } else if (typeof data.thumbnail === "string") {
        thumbnailUrl = data.thumbnail; // Use existing URL if provided
      }

      // Prepare data for submission
      const submitData: CourseFormData = {
        title: data.title,
        description: data.description,
        level: data.level,
        price: data.price ? Number(data.price) : undefined,
        thumbnail: thumbnailUrl,
        duration: data.duration,
        offer: data.offer ? Number(data.offer) : undefined,
        categoryId: data.categoryId,
        prerequisites: data.prerequisites,
        longDescription: data.longDescription,
        objectives: data.objectives,
        targetAudience: data.targetAudience,
      };

      if (externalOnSubmit) {
        await externalOnSubmit(submitData);
      } else {
        createCourse(submitData);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while submitting the form");
      setThumbnailUploadStatus(FileUploadStatus.ERROR);
      setThumbnailUploadProgress(0);
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      schema={courseSchema}
      initialData={
        initialData
          ? { ...initialData, thumbnail: initialData.thumbnail || undefined }
          : undefined
      }
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