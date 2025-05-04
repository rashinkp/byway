"use client";

import { Course, CourseEditFormData } from "@/types/course";
import { Edit, Check, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { StaticImageData } from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";
import { courseEditSchema } from "@/lib/validations/course";
import { useUpdateCourse } from "@/hooks/course/useUpdateCourse";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { ImageSection } from "./CourseDetailsImageSection";
import { DetailsSection } from "./CourseDetailsSection";
import { OverviewSection } from "./CourseOverviewSection";
import { ObjectivesSection } from "./CourseObjectiveSection";
import { ActionSection } from "./CourseActionSection";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdditionalDetailsSection } from "./CourseAdditionalDetails";

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

  const form = useForm<CourseEditFormData>({
    resolver: zodResolver(courseEditSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      level: (course?.level as "BEGINNER" | "MEDIUM" | "ADVANCED") || "BEGINNER",
      price: course?.price || 0,
      duration: course?.duration ?? 0,
      offer: course?.offer || undefined,
      status: course?.status || "DRAFT",
      thumbnail: course?.thumbnail || undefined,
    },
  });

  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title || "",
        description: course.description || "",
        level: (course.level as "BEGINNER" | "MEDIUM" | "ADVANCED") || "BEGINNER",
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
      setUploadProgress(null);
      form.setValue("thumbnail", result.secure_url);
      const formData = form.getValues();
      onSubmit(formData);
    } catch (error: any) {
      setUploadProgress(null);
      const errorMessage = error.message.includes("Upload preset not found")
        ? "Image upload failed: Invalid Cloudinary configuration. Please contact support."
        : error.message || "Failed to upload image.";
      setUploadError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const onSubmit = (data: CourseEditFormData) => {
    if (!course) return;
    updateCourse(
      { data, id: course.id },
      {
        onSuccess: () => {
          toast.success("Course updated successfully!", {
            description: `The course "${data.title}" has been updated.`,
          });
          form.reset(data);
          setIsEditing(false);
        },
        onError: (error: any) => {
          toast.error("Failed to update course", {
            description:
              error.message ||
              `An error occurred while updating "${data.title}". Please try again.`,
          });
        },
      }
    );
  };

  const onToggleDelete = () => {
    if (!course) return;
    toggleDeleteCourse(course, {
      onSuccess: () => {
        toast.success(
          `Course ${course.deletedAt ? "restored" : "disabled"} successfully.`,
          {
            description: `The course "${course.title}" is now ${
              course.deletedAt ? "active" : "inactive"
            }.`,
          }
        );
      },
      onError: (error: any) => {
        toast.error("Failed to toggle course status", {
          description:
            error?.response?.data?.message ||
            `An error occurred while updating the status of "${course.title}". Please try again.`,
        });
      },
    });
  };

  const onPublish = () => {
    if (!course) return;
    const newStatus = course.status === "DRAFT" ? "PUBLISHED" : "DRAFT";
    form.setValue("status", newStatus);
    form.handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <ImageSection
          src={src}
          alt={alt}
          onImageChange={handleImageUpload}
          isUploading={uploadProgress !== null}
          uploadProgress={uploadProgress}
          uploadError={uploadError}
        />
        <div className="flex-1">
          {!isEditing && (
            <Button
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="mb-4 text-primary hover:text-primary/80"
              disabled={!course}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </Button>
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
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isUpdating || !course || uploadProgress !== null}
                  className="bg-primary hover:bg-primary/90 text-white"
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
                  variant="ghost"
                  onClick={() => {
                    form.reset();
                    setIsEditing(false);
                    setUploadProgress(null);
                  }}
                  disabled={isUpdating || !course}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <DetailsSection
              course={course}
              isEditing={isEditing}
              form={form}
              onImageUpload={handleImageUpload}
              uploadProgress={uploadProgress}
            />
          )}
        </div>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="objectives">Objectives</TabsTrigger>
        </TabsList>
        <OverviewSection course={course} isEditing={isEditing} form={form} />
        <AdditionalDetailsSection course={course} />
        <ObjectivesSection />
      </Tabs>
      {course && (
        <ActionSection
          course={course}
          isEditing={isEditing}
          isUpdating={isUpdating}
          onPublish={onPublish}
          onToggleDelete={onToggleDelete}
        />
      )}
    </div>
  );
}