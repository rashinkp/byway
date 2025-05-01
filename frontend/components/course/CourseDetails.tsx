"use client";

import { Course, CourseEditFormData } from "@/types/course";
import { Edit, Check, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { StaticImageData } from "next/image";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageSection } from "./CourseDetailsImageSection";
import { DetailsSection } from "./CourseDetailsSection";
import { DetailsSectionSkeleton } from "../skeleton/CourseDetailSectionSkeleton";
import { OverviewSection } from "./CourseOverviewSection";
import { ObjectivesSection } from "./CourseObjectiveSection";
import { ActionSection } from "./CourseActionSection";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";
import { courseEditSchema } from "@/lib/validations/course";
import { useUpdateCourse } from "@/hooks/course/useUpdateCourse";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";

export function CourseDetails({
  course,
  src,
  alt,
  isLoading,
}: {
  course?: Course;
  src: string | StaticImageData;
  alt: string;
  isLoading: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { mutate: toggleDeleteCourse } = useSoftDeleteCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const form = useForm<CourseEditFormData>({
    resolver: zodResolver(courseEditSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      level:
        (course?.level as "BEGINNER" | "MEDIUM" | "ADVANCED") || "BEGINNER",
      price: course?.price || 0,
      duration: course?.duration ?? 0,
      offer: course?.offer || undefined,
      status: course?.status || "DRAFT",
      thumbnail: course?.thumbnail || undefined,
    },
  });

  // Sync form with course changes
  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title || "",
        description: course.description || "",
        level: (course.level === "MEDIUM" ? "MEDIUM" : course.level) as
          | "BEGINNER"
          | "MEDIUM"
          | "ADVANCED",
        price: course.price || 0,
        duration: course.duration || 0,
        offer: course.offer || undefined,
        status: course.status || "DRAFT",
        thumbnail: course.thumbnail || undefined,
      });
    }
  }, [course, form]);

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      // Cancel upload
      if (xhrRef.current) {
        xhrRef.current.abort();
        xhrRef.current = null;
      }
      setUploadProgress(null);
      setUploadError(null);
      form.setValue("thumbnail", course?.thumbnail || undefined);
      return;
    }

    try {
      setUploadProgress(0);
      setUploadError(null);
      const result = await uploadToCloudinary(file, {
        folder: "courses",
        onProgress: ({ percent }) => setUploadProgress(percent),
      });
      xhrRef.current = result.xhr;
      setUploadProgress(null);
      form.setValue("thumbnail", result.secure_url);

      // Automatically submit the form to update the course
      const formData = form.getValues();
      onSubmit(formData);
    } catch (error: any) {
      setUploadProgress(null);
      let errorMessage = error.message || "Failed to upload image.";
      if (error.message.includes("Upload preset not found")) {
        errorMessage =
          "Image upload failed: Invalid Cloudinary configuration. Please contact support.";
      }
      setUploadError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const onSubmit = (data: CourseEditFormData) => {
    if (!course) return;
    console.log("Submitting form data:", data);
    updateCourse(
      { data, id: course.id },
      {
        onSuccess: () => {
          form.reset(data);
          setIsEditing(false);
        },
        onError: (error: any) => {
          console.error("Error updating course:", error);
        },
      }
    );
  };

  const onToggleDelete = () => {
    if (!course) return;
    try {
      toggleDeleteCourse(course, {
        onSuccess: () => {
          toast.success(
            `Course ${course.deletedAt ? "restored" : "disabled"} successfully.`
          );
        },
        onError: (error: any) => {
          console.error("Error toggling course delete:", error);
          toast.error(
            error?.response?.data?.message ||
              "Failed to toggle course status. Please try again."
          );
        },
      });
    } catch (error) {
      console.error("Failed to toggle delete course:", error);
    }
  };

  const onPublish = () => {
    if (!course) return;
    const newStatus = course.status === "DRAFT" ? "PUBLISHED" : "DRAFT";
    form.setValue("status", newStatus);
    form.handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return <DetailsSectionSkeleton />;
  }

  return (
    <div className="p-6 space-y-8">
      <ImageSection
        src={src}
        alt={alt}
        onImageChange={handleImageUpload}
        isUploading={uploadProgress !== null}
        uploadProgress={uploadProgress}
        uploadError={uploadError}
      />
      {!isEditing && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            aria-label="Edit course details"
            className="text-primary hover:bg-primary/10"
            disabled={!course}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        </div>
      )}
      {isEditing ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DetailsSection
            course={course}
            isEditing={isEditing}
            form={form}
            onImageUpload={handleImageUpload}
            uploadProgress={uploadProgress}
          />
          <OverviewSection course={course} isEditing={isEditing} form={form} />
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={isUpdating || !course || uploadProgress !== null}
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
                setUploadProgress(null);
              }}
              disabled={isUpdating || !course}
              className="text-gray-700"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <DetailsSection
            course={course}
            isEditing={isEditing}
            form={form}
            onImageUpload={handleImageUpload}
            uploadProgress={uploadProgress}
          />
          <OverviewSection course={course} isEditing={isEditing} form={form} />
          <ObjectivesSection />
          {course && (
            <ActionSection
              course={course}
              isEditing={isEditing}
              isUpdating={isUpdating}
              onPublish={onPublish}
              onToggleDelete={onToggleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}
