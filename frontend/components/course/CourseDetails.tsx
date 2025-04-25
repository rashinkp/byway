"use client";

import { Course } from "@/types/course";
import {
  BookOpen,
  Upload,
  Edit,
  Check,
  X,
  Loader2,
  Recycle,
} from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { Button } from "../ui/button";
import { StaticImageData } from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/utils/formatDate";
import { ImageSection } from "./CourseDetailsImageSection";
import { DetailsSection } from "./CourseDetailsSection";
import { OverviewSection } from "./CourseOverviewSection";
import { ObjectivesSection } from "./CourseObjectiveSection";
import { ActionSection } from "./CourseActionSection";

// Schema for editing
const courseEditSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  price: z.number().min(0, "Price cannot be negative"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  offer: z.number().min(0, "Offer price cannot be negative").optional(),
});

type CourseEditFormData = z.infer<typeof courseEditSchema>;

// ImageSection Component


// DetailsSection Component


// OverviewSection Component

// ObjectivesSection Component


// ActionSection Component

// Main CourseDetails Component
export function CourseDetails({
  course,
  onPublish,
  src,
  alt,
  onImageChange,
  isUploading,
}: {
  course: Course;
  onPublish: () => void;
  src: string | StaticImageData;
  alt: string;
  onImageChange: () => void;
  isUploading: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: updateCourse, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CourseEditFormData;
    }) => {
      // const response = await api.patch(`/courses/${id}`, data);
      // return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", course.id] });
      setIsEditing(false);
    },
    onError: (err) => {
      console.error("Failed to update course:", err);
    },
  });

  const form = useForm<CourseEditFormData>({
    resolver: zodResolver(courseEditSchema),
    defaultValues: {
      title: course.title,
      description: course.description || "",
      level: course.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
      price: course.price || 0,
      duration: course.duration ?? 0,
      offer: course.offer || undefined,
    },
  });

  const onSubmit = (data: CourseEditFormData) => {
    updateCourse({ id: course.id, data });
  };

  const onToggleDelete = () => {
    // Implement toggleDeleteCourse logic here
  };

  return (
    <div className="p-6 rounded-xl shadow-sm border border-gray-100 space-y-8">
      <ImageSection
        src={src}
        alt={alt}
        onImageChange={onImageChange}
        isUploading={isUploading}
      />
      {!isEditing && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            aria-label="Edit course details"
            className="text-primary hover:bg-primary/10"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        </div>
      )}
      {isEditing ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DetailsSection course={course} isEditing={isEditing} form={form} />
          <OverviewSection course={course} isEditing={isEditing} form={form} />
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white"
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setIsEditing(false);
              }}
              disabled={isUpdating}
              className="text-gray-700"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <DetailsSection course={course} isEditing={isEditing} form={form} />
          <OverviewSection course={course} isEditing={isEditing} form={form} />
          <ObjectivesSection />
          <ActionSection
            course={course}
            isEditing={isEditing}
            isUpdating={isUpdating}
            onPublish={onPublish}
            onToggleDelete={onToggleDelete}
          />
        </>
      )}
    </div>
  );
}
