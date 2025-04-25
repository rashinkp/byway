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
export const ImageSection = ({
  src,
  alt,
  onImageChange,
  isUploading,
}: {
  src: string | StaticImageData;
  alt: string;
  onImageChange: () => void;
  isUploading: boolean;
}) => (
  <div className="relative group mb-6">
    <img
      src={typeof src === "string" ? src : src.src}
      alt={alt}
      className="w-full h-64 object-contain rounded-lg"
    />
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
      <Button
        variant="outline"
        className="text-black border-white hover:bg-white/20"
        onClick={onImageChange}
        disabled={isUploading}
        aria-label="Change course thumbnail"
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Change Image"}
      </Button>
    </div>
  </div>
);

// DetailsSection Component
const DetailsSection = ({
  course,
  isEditing,
  form,
}: {
  course: Course;
  isEditing: boolean;
  form: any;
}) => {
  const { register, formState } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Id</h3>
          {isEditing ? (
            <Input
              {...register("id")}
              className="mt-1"
              placeholder="Course ID"
              disabled
              value={course.id}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">{course.id}</p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Level</h3>
          {isEditing ? (
            <Select
              onValueChange={(value) =>
                form.setValue(
                  "level",
                  value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
                )
              }
              defaultValue={course.level}
              disabled={form.formState.isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Price</h3>
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="mt-1 w-32"
              placeholder="Price"
              disabled={form.formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              ${course?.price?.toFixed(2) || "0.00"}
            </p>
          )}
          {formState.errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.price.message}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Offer Price</h3>
          {isEditing ? (
            <Input
              type="number"
              step="0.01"
              {...register("offer", { valueAsNumber: true })}
              className="mt-1 w-32"
              placeholder="Offer Price"
              disabled={form.formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              $
              {course?.offer?.toFixed(2) || course?.price?.toFixed(2) || "0.00"}
            </p>
          )}
          {formState.errors.offer && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.offer.message}
            </p>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Duration</h3>
          {isEditing ? (
            <Input
              type="number"
              {...register("duration", { valueAsNumber: true })}
              className="mt-1 w-32"
              placeholder="Duration (minutes)"
              disabled={form.formState.isSubmitting}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              {course?.duration || "Not available"} minutes
            </p>
          )}
          {formState.errors.duration && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.duration.message}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Status</h3>
          {isEditing ? (
            <Select
              onValueChange={(value) =>
                form.setValue(
                  "deletedAt",
                  value === "true" ? new Date().toISOString() : null
                )
              }
              defaultValue={course.deletedAt ? "true" : "false"}
              disabled={form.formState.isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Active</SelectItem>
                <SelectItem value="true">Disabled</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <StatusBadge isActive={!course.deletedAt} className="mt-1" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Stage</h3>
          {isEditing ? (
            <Select
              onValueChange={(value) => form.setValue("status", value)}
              defaultValue={course.status}
              disabled={form.formState.isSubmitting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          ) : course.status === "DRAFT" ? (
            <p className="mt-1 text-gray-900 font-medium">Draft</p>
          ) : course.status === "PUBLISHED" ? (
            <p className="mt-1 text-green-600 font-medium">Published</p>
          ) : course.status === "ARCHIVED" ? (
            <p className="mt-1 text-red-600 font-medium">Archived</p>
          ) : null}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Created At</h3>
          {isEditing ? (
            <Input
              type="text"
              {...register("createdAt")}
              className="mt-1"
              placeholder="Created At"
              disabled
              value={formatDate(course?.createdAt) || "Not available"}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              {formatDate(course?.createdAt) || "Not available"}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Updated At</h3>
          {isEditing ? (
            <Input
              type="text"
              {...register("updatedAt")}
              className="mt-1"
              placeholder="Updated At"
              disabled
              value={formatDate(course?.updatedAt) || "Not Updated yet"}
            />
          ) : (
            <p className="mt-1 text-gray-900 font-medium">
              {formatDate(course?.updatedAt) || "Not Updated yet"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// OverviewSection Component
const OverviewSection = ({
  course,
  isEditing,
  form,
}: {
  course: Course;
  isEditing: boolean;
  form: any;
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-gray-900">Course Overview</h2>
    {isEditing ? (
      <Textarea
        {...form.register("description")}
        className="mt-1 min-h-[100px]"
        placeholder="Course description"
        disabled={form.formState.isSubmitting}
      />
    ) : (
      <p className="text-gray-600 leading-relaxed">
        {course.description || "No description available."}
      </p>
    )}
  </div>
);

// ObjectivesSection Component
const ObjectivesSection = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-gray-900">Key Learning Objectives</h2>
    <ul className="list-disc list-inside text-gray-600 space-y-2">
      <li>
        Gain a clear understanding of what User Experience (UX) Design entails
        and its importance in today’s digital world.
      </li>
      <li>
        Explore the fundamental principles of user-centered design and how to
        apply them to create intuitive and user-friendly interfaces.
      </li>
      <li>
        Learn about the various elements that contribute to a positive user
        experience, including information architecture, interaction design, and
        visual design.
      </li>
    </ul>
  </div>
);

// ActionSection Component
const ActionSection = ({
  course,
  isEditing,
  isUpdating,
  onPublish,
  onToggleDelete,
}: {
  course: Course;
  isEditing: boolean;
  isUpdating: boolean;
  onPublish: () => void;
  onToggleDelete: () => void;
}) => (
  <div className="flex justify-end gap-2 mt-6">
    <Button
      onClick={onToggleDelete}
      disabled={isEditing || isUpdating}
      className={
        !course.deletedAt
          ? "bg-red-600 hover:bg-red-700"
          : "bg-emerald-600 hover:bg-emerald-700"
      }
    >
      <Recycle className="mr-2 h-4 w-4" />
      {!course.deletedAt ? "Disable" : "Enable"}
    </Button>
    <Button
      onClick={onPublish}
      disabled={isEditing || isUpdating}
      className={
        course.status === "PUBLISHED"
          ? "bg-amber-600 hover:bg-amber-700"
          : "bg-emerald-600 hover:bg-emerald-700"
      }
    >
      {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
    </Button>
  </div>
);

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
